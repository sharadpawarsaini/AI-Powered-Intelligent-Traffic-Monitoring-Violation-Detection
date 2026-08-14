from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.schemas import UserCreate, UserResponse, Token, UserLogin, UserRole
from app.services.db_service import db_service
from app.services.auth_service import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    existing = await db_service.get_user_by_email(user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user_dict = {
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": get_password_hash(user_in.password),
        "role": user_in.role if user_in.role in [UserRole.ADMIN, UserRole.OPERATOR, UserRole.VIEWER] else UserRole.OPERATOR
    }
    created = await db_service.create_user(user_dict)
    return UserResponse(
        id=created["id"],
        name=created["name"],
        email=created["email"],
        role=created["role"],
        created_at=created["created_at"]
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db_service.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user["role"],
        name=user["name"]
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )
