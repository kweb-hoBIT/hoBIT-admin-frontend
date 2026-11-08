import React from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllAdminLogRequest, GetAllAdminLogResponse } from '../../../types/adminLog';
import AdminLogMainForm from './AdminLogMainForm';
import { ListSkeleton, LoadError } from '../../ui/ListKit';

const AdminLogMain: React.FC = () => {
  const api = useHobitQueryGetApi<GetAllAdminLogRequest, GetAllAdminLogResponse>('adminlogs');
  const payload = api.data?.payload;
  // 받아 둔 데이터를 바로 씀 — 다시 받는 동안에도 이전 목록을 그대로 보여줌
  const list = payload?.statusCode === 200 ? payload.data.adminLogs : null;

  if (!list) {
    return (
      <div className="p-3 sm:p-6">
        {api.isPending || api.isFetching ? (
          <ListSkeleton />
        ) : (
          <LoadError message="관리자 로그를 불러오지 못했어요." onRetry={() => api.refetch()} />
        )}
      </div>
    );
  }

  return <AdminLogMainForm adminLogs={list} />;
};

export default AdminLogMain;
