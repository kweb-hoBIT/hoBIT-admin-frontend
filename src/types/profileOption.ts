// 프로필 항목 — 학생이 고르는 학과·전공 유형·학적 상태 (관리자 백엔드 routes/api/profileOptions)
export type ProfileField = 'department' | 'major_type' | 'student_status';

export type ProfileOption = {
  id: number;
  field: ProfileField;
  value: string;
  label_en: string;
  aliases: string[];
  first_cohort: number | null;
  sort_order: number;
  active: boolean;
  updated_at: string;
};

export type GetProfileOptionsRequest = {};
export type GetProfileOptionsResponse = { statusCode: number; message: string; data: { options: ProfileOption[] } };

export type ProfileOptionBody = {
  field: ProfileField;
  value: string;
  label_en: string;
  aliases: string[];
  first_cohort: number | null;
  active: boolean;
};

export type CreateProfileOptionRequest = { body: ProfileOptionBody };
export type CreateProfileOptionResponse = { statusCode: number; message: string; data?: { id: number } };

export type UpdateProfileOptionRequest = { params: { id: string }; body: ProfileOptionBody | { field: ProfileField; ids: number[] } };
export type UpdateProfileOptionResponse = { statusCode: number; message: string };

export type DeleteProfileOptionRequest = { params: { id: string } };
export type DeleteProfileOptionResponse = { statusCode: number; message: string };
