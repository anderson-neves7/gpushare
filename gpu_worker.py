import json
import time
import traceback
from datetime import datetime

import torch
import torch.nn as nn

import redis

# -----------------------------
# CONNECT TO REDIS ON LAPTOP
# -----------------------------
REDIS_HOST = "localhost"   # your laptop IP
REDIS_PORT = 6379

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=0,
    decode_responses=False
)

print(f"Connected to Redis at {REDIS_HOST}:{REDIS_PORT}")


# -----------------------------
# GPU EXECUTION FUNCTION
# -----------------------------
def execute_gpu_code(code: str):
    """
    Executes GPU code with FULL Python builtins.
    This is required because PyTorch dynamically loads modules.
    """

    safe_globals = {
        "__builtins__": __builtins__,   # <-- allow full Python
        "torch": torch,
        "nn": nn,
    }

    safe_locals = {}

    try:
        exec(code, safe_globals, safe_locals)
        return safe_locals.get("result", None)
    except Exception as e:
        return f"GPU execution error: {e}"


# -----------------------------
# PROCESS GPU JOB
# -----------------------------
def process_gpu_job(job_payload: dict):
    job_id = job_payload.get("job_id")
    print(f"Processing GPU job: {job_payload}")

    try:
        code = job_payload.get("code", "")
        result = execute_gpu_code(code)

        # Update Redis metadata
        redis_client.hset(f"job:{job_id}", "status", "completed")
        redis_client.hset(f"job:{job_id}", "result", str(result))

        print(f"GPU job {job_id} completed successfully.")

    except Exception as e:
        print(f"Error processing GPU job {job_id}: {e}")
        traceback.print_exc()

        redis_client.hset(f"job:{job_id}", "status", "failed")
        redis_client.hset(f"job:{job_id}", "result", str(e))


# -----------------------------
# MAIN WORKER LOOP
# -----------------------------
def gpu_worker_loop():
    print("GPU Worker started. Waiting for GPU jobs...")

    while True:
        try:
            _, raw = redis_client.blpop("gpu_job_queue")
            job_payload = json.loads(raw)
            process_gpu_job(job_payload)

        except Exception as e:
            print(f"GPU worker loop error: {e}")
            traceback.print_exc()
            time.sleep(1)


if __name__ == "__main__":
    gpu_worker_loop()
