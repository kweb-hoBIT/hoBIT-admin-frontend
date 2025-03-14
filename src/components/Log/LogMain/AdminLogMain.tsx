import React, { useEffect, useState } from 'react';
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllAdminLogRequest, GetAllAdminLogResponse } from '../../../types/adminLog';
import AdminLogMainForm from './AdminLogMainForm';

const AdminLogMain: React.FC = () => {
  const [adminLogData, setAdminLogData] = useState<GetAllAdminLogResponse['data']['adminLogs']>([]);
  const [error, setError] = useState<string | null>(null);

  const GetAdminLogsApi = useHobitQueryGetApi<GetAllAdminLogRequest, GetAllAdminLogResponse>('adminlogs');

  // FAQ 로그 데이터 가져오기
  useEffect(() => {
    const fetchFAQLogData = async () => {
      if (GetAdminLogsApi.data?.payload?.statusCode === 200) {
        const data = GetAdminLogsApi.data.payload.data.adminLogs;
        setAdminLogData(data);
      } else {
        setError('FAQ 로그 데이터를 가져오는 중 오류 발생');
        console.log('FAQ 로그 데이터를 가져오는 중 오류 발생:', GetAdminLogsApi.error);
      }
    };

    if (GetAdminLogsApi.isSuccess && GetAdminLogsApi.data) {
      fetchFAQLogData();
    }
  }, [GetAdminLogsApi.isSuccess, GetAdminLogsApi.data]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (GetAdminLogsApi.isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <AdminLogMainForm adminLogs={adminLogData} />
    </div>
  );
};

export default AdminLogMain;
