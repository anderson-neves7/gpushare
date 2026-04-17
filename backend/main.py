from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.routes_auth import router as auth_router
from routes.routes_gpus import router as gpus_router
from routes.routes_rentals import router as rentals_router
from routes.routes_jobs import router as jobs_router
from routes.routes_compute import router as compute_router

from database import init_db

app = FastAPI(
    title="GPU Share Platform",
    description="Backend API for GPU rental marketplace and compute engine",
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router)
app.include_router(gpus_router)
app.include_router(rentals_router)
app.include_router(jobs_router)
app.include_router(compute_router)


@app.on_event("startup")
def on_startup():
    init_db()


# Custom OpenAPI with JWT support
original_openapi = app.openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = original_openapi()

    components = openapi_schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})

    security_schemes["JWT"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Paste your token here: Bearer <token>",
    }

    openapi_schema["security"] = [{"JWT": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
