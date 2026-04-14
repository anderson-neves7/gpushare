import json
import time
import traceback
from datetime import datetime
import math
import random

from redis_client import redis_client
from database import SessionLocal
from models import Job


# ---- sandbox helpers ----

SAFE_BUILTINS = {
    "abs": abs,
    "min": min,
    "max": max,
    "range": range,
    "len": len,
    "sum": sum,
    "print": print,
}

SAFE_MODULES = {
    "math": math,
    "random": random,
    # you can add more safe modules here later, e.g. "time": time
}


def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    """
    Very restricted __import__ replacement.
    Only allows modules explicitly listed in SAFE_MODULES.
    """
    if name in SAFE_MODULES:
        return SAFE_MODULES[name]
    raise ImportError(f"Module '{name}' is not allowed in this sandbox")


def execute_code_safely(code: str):
    """
    Executes user code in a restricted environment.
    Returns the value of `result` if set.
    """
    safe_globals = {
        "__builtins__": {**SAFE_BUILTINS, "__import__": safe_import},
    }
    safe_locals = {}

    try:
        exec(code, safe_globals, safe_locals)
        return safe_locals.get("result", None)
    except Exception as e:
        return f"Error during execution: {e}"


# ---- job processing ----

def process_job(job_payload: dict):
    """
    Process a single job from Redis.
    """
    session = SessionLocal()
    job_id = job_payload.get("job_id")

    try:
        job = session.query(Job).filter(Job.id == job_id).first()
        if not job:
            print(f"Job {job_id} not found in database.")
            return

        print(f"Processing job: {job_payload}")

        # Execute the code
        result = execute_code_safely(job_payload.get("code", ""))

        # Update job fields
        job.status = "completed"
        job.result = str(result)
        job.completed_at = datetime.utcnow()  # correct type for TIMESTAMP

        session.commit()

        # Update Redis metadata
        redis_client.hset(f"job:{job_id}", "status", "completed")
        redis_client.hset(f"job:{job_id}", "result", job.result)

        print(f"Job {job_id} completed successfully.")

    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
        traceback.print_exc()

        # Mark job as failed
        job = session.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = "failed"
            job.result = str(e)
            job.completed_at = datetime.utcnow()
            session.commit()

        redis_client.hset(f"job:{job_id}", "status", "failed")
        redis_client.hset(f"job:{job_id}", "result", str(e))

    finally:
        session.close()


def worker_loop():
    """
    Main worker loop: waits for jobs in Redis and processes them.
    """
    print("Worker started. Listening for jobs...")

    while True:
        try:
            # BLPOP blocks until a job arrives
            _, raw = redis_client.blpop("job_queue")
            job_payload = json.loads(raw)
            process_job(job_payload)

        except Exception as e:
            print(f"Worker loop error: {e}")
            traceback.print_exc()
            time.sleep(1)


if __name__ == "__main__":
    worker_loop()
