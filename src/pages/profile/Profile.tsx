import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { HiOutlineCamera, HiOutlineCheck, HiOutlineX, HiOutlineLockClosed, HiOutlineUser, HiOutlineDocumentText, HiOutlinePhotograph } from 'react-icons/hi';

// API 기본 URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// 프로필 페이지 컴포넌트
const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading, updateUserInfo } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 프로필 수정 관련 상태
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [originalUsername, setOriginalUsername] = useState<string>('');
    const [originalBio, setOriginalBio] = useState<string>('');

    // 소셜 로그인 사용자 여부
    const isSocialUser = user?.provider !== undefined && user?.provider !== null && user?.provider !== '';

    // 비밀번호 관련 상태
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // 상태 표시
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // 사용자 정보 로드
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login'); // 로그인되지 않은 경우 로그인 페이지로 이동
            return;
        }

        if (user) {
            console.log('user?: ', user)
            setProfileImage(user.profileImgUrl || null);
            setUsername(user.userNm || '');
            setOriginalUsername(user.userNm || '');
            // BIO 정보 로드 - API 호출 필요
            fetchUserBio();
        }
    }, [user, loading, isAuthenticated, navigate]);

    // 사용자 BIO 정보 가져오기
    const fetchUserBio = async () => {
        if (!user?.userId) return;

        try {
            const response = await axios.get(`${API_URL}/user/${user.userId}/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            const userBio = response.data.data?.bio || '';
            setBio(userBio);
            setOriginalBio(userBio);
        } catch (err) {
            console.error('사용자 정보 로드 오류:', err);
            setBio('');
            setOriginalBio('');
        }
    };

    // 프로필 이미지 변경 핸들러
    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };


    // 파일 선택 핸들러에 파일 타입 확인 로직 추가
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("파일 타입:", file.type); // 로그로 파일 타입 확인
            
            // 서버에서 지원하는 이미지 형식인지 확인
            const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!supportedTypes.includes(file.type)) {
                setError("지원하지 않는 이미지 형식입니다. JPG, PNG, GIF, WEBP 형식만 사용 가능합니다.");
                return;
            }
            
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    // 이미지 변경 취소
    const handleCancelImageChange = () => {
        setProfileImage(user?.profileImgUrl || null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 프로필 정보 저장 핸들러
    const handleSaveProfile = async () => {
        if (!user?.userId) return;

        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. 이미지 업로드 (변경된 경우)
            let profileImgUrl = user?.profileImgUrl || null;
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                
                const uploadResponse = await axios.post(`${API_URL}/file/profile-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                profileImgUrl = uploadResponse.data.data.fileUrl;
            }

            // 2. 프로필 정보 업데이트
            const updateData = {
                userId: user.userId,
                userNm: username,
                profileImgUrl,
                bio
            };

            await axios.put(`${API_URL}/user/${user.userId}/profile`, updateData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // 3. AuthContext의 사용자 정보 업데이트
            updateUserInfo({
                ...user,
                userNm: username,
                profileImgUrl: profileImage || undefined
            });

            setOriginalUsername(username);
            setOriginalBio(bio);
            setSuccess('프로필이 성공적으로 업데이트되었습니다.');
            
            // 이미지 파일 상태 초기화
            setImageFile(null);
            
            // 3초 후 성공 메시지 제거
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            console.error('프로필 업데이트 오류:', err);
            setError('프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    // 비밀번호 변경 핸들러
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.userId) return;
        
        // 입력 검증
        if (newPassword !== confirmPassword) {
            setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (newPassword.length < 6) {
            setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }
        
        setPasswordError(null);
        setPasswordSuccess(null);
        setIsSaving(true);
        
        try {
            // 비밀번호 변경 API 호출
            const response = await axios.put(`${API_URL}/user/${user.userId}/password`, {
                userId: user.userId,
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            // 상태 업데이트 및 입력 필드 초기화
            setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            // 3초 후 성공 메시지 제거
            setTimeout(() => {
                setPasswordSuccess(null);
            }, 3000);
        } catch (err: any) {
            console.error('비밀번호 변경 오류:', err);
            // 에러 메시지 처리 개선
            if (err.response?.data?.code === 'U004') {
                setPasswordError('소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.');
            } else if (err.response?.data?.code === 'U003') {
                setPasswordError('현재 비밀번호가 일치하지 않습니다.');
            } else {
                setPasswordError(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // 로딩 표시
    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    const hasProfileChanges = username !== originalUsername || bio !== originalBio || imageFile !== null;

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8 text-base-content">내 프로필</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 프로필 정보 섹션 */}
                    <div className="lg:col-span-2">
                        <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden mb-8">
                            <div className="p-6 border-b border-base-300">
                                <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center">
                                    <HiOutlineUser className="mr-2" />
                                    프로필 정보
                                </h2>

                                {/* 소셜 로그인 표시 */}
                                {isSocialUser && (
                                    <div className="mb-4 flex items-center bg-base-200 p-3 rounded-md">
                                        <span className="text-sm font-medium text-base-content flex items-center">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            {user?.provider || 'Social'} 계정으로 로그인됨
                                        </span>
                                    </div>
                                )}

                                {/* 프로필 사진 */}
                                <div className="mb-6 flex items-center">
                                    <div className="relative group">
                                        <div 
                                            className="w-24 h-24 rounded-full overflow-hidden border-4 border-base-300 cursor-pointer"
                                            onClick={handleProfileImageClick}
                                        >
                                            {profileImage ? (
                                                <img 
                                                    src={profileImage} 
                                                    alt="프로필" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-primary text-primary-content flex items-center justify-center text-4xl">
                                                    {username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div 
                                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={handleProfileImageClick}
                                        >
                                            <HiOutlineCamera className="text-white text-2xl" />
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {imageFile && (
                                        <button 
                                            className="ml-4 text-error hover:text-error-focus"
                                            onClick={handleCancelImageChange}
                                        >
                                            <HiOutlineX className="mr-1 inline" />
                                            취소
                                        </button>
                                    )}

                                    <div className="ml-6">
                                        <p className="text-sm text-base-content/70">
                                            클릭하여 프로필 사진을 변경할 수 있습니다. <br />
                                            권장 크기: 300x300 픽셀
                                        </p>
                                    </div>
                                </div>

                                {/* 사용자 이름 */}
                                <div className="mb-6">
                                    <label className="block text-base-content mb-2">사용자 이름</label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full max-w-md text-base-content/70" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="사용자 이름 입력"
                                    />
                                </div>

                                {/* 자기소개 */}
                                <div className="mb-6">
                                    <label className="block text-base-content mb-2">자기소개</label>
                                    <textarea 
                                        className="textarea textarea-bordered w-full h-32 text-base-content/70" 
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="자기소개를 입력하세요"
                                    ></textarea>
                                </div>

                                {/* 에러/성공 메시지 */}
                                {error && (
                                    <div className="alert alert-error mb-4">
                                        <HiOutlineX className="mr-2" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success mb-4">
                                        <HiOutlineCheck className="mr-2" />
                                        <span>{success}</span>
                                    </div>
                                )}

                                {/* 저장 버튼 */}
                                <div className="flex justify-end">
                                    <button 
                                        className={`btn btn-primary text-base-content ${isSaving ? 'loading' : ''}`}
                                        onClick={handleSaveProfile}
                                        disabled={isSaving || !hasProfileChanges}
                                    >
                                        {!isSaving && <HiOutlineCheck className="mr-1" />}
                                        프로필 저장
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 비밀번호 변경 섹션 - 소셜 로그인 사용자에게는 표시하지 않음 */}
                    {!isSocialUser && (
                        <div>
                            <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-base-300">
                                    <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center">
                                        <HiOutlineLockClosed className="mr-2" />
                                        비밀번호 변경
                                    </h2>

                                    <form onSubmit={handleChangePassword}>
                                        {/* 현재 비밀번호 */}
                                        <div className="mb-4">
                                            <label className="block text-base-content mb-2">현재 비밀번호</label>
                                            <input 
                                                type="password" 
                                                className="input input-bordered w-full" 
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="현재 비밀번호"
                                                required
                                            />
                                        </div>

                                        {/* 새 비밀번호 */}
                                        <div className="mb-4">
                                            <label className="block text-base-content/70 mb-2">새 비밀번호</label>
                                            <input 
                                                type="password" 
                                                className="input input-bordered w-full" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="새 비밀번호"
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        {/* 비밀번호 확인 */}
                                        <div className="mb-6">
                                            <label className="block text-base-content/70 mb-2">비밀번호 확인</label>
                                            <input 
                                                type="password" 
                                                className="input input-bordered w-full" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="비밀번호 확인"
                                                required
                                            />
                                        </div>

                                        {/* 에러/성공 메시지 */}
                                        {passwordError && (
                                            <div className="alert alert-error mb-4">
                                                <HiOutlineX className="mr-2" />
                                                <span>{passwordError}</span>
                                            </div>
                                        )}

                                        {passwordSuccess && (
                                            <div className="alert alert-success mb-4">
                                                <HiOutlineCheck className="mr-2" />
                                                <span>{passwordSuccess}</span>
                                            </div>
                                        )}

                                        {/* 저장 버튼 */}
                                        <div className="flex justify-end">
                                            <button 
                                                type="submit"
                                                className={`btn btn-primary ${isSaving ? 'loading' : ''}`}
                                                disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                                            >
                                                {!isSaving && <HiOutlineCheck className="mr-1" />}
                                                비밀번호 변경
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 소셜 로그인 사용자를 위한 설명 (비밀번호 변경 섹션 대체) */}
                    {isSocialUser && (
                        <div>
                            <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-base-300">
                                    <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center">
                                        <HiOutlineLockClosed className="mr-2" />
                                        계정 정보
                                    </h2>
                                    
                                    <div className="bg-base-200 p-4 rounded-md">
                                        <p className="text-base-content mb-2">
                                            <span className="font-semibold">{user?.provider || 'Social'} 계정</span>으로 로그인 중입니다.
                                        </p>
                                        <p className="text-sm text-base-content/70">
                                            소셜 로그인 사용자는 비밀번호를 별도로 관리하지 않습니다. 계정 관련 보안 설정은 해당 서비스 제공자의 계정 설정에서 관리하세요.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;