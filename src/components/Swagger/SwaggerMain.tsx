import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { SwaggerRequest, SwaggerResponse } from '../../types/swagger';

const SwaggerMain: React.FC = () => {
  const [swaggerData, setSwaggerData] = useState<SwaggerResponse['data'] | null>(null);

  const GetSwaggerApi = useHobitQueryGetApi<SwaggerRequest, SwaggerResponse>('swagger.json');

  useEffect(() => {
    if (GetSwaggerApi.data?.payload?.statusCode === 200) {
      setSwaggerData(GetSwaggerApi.data.payload.data);
    } else if (GetSwaggerApi.isError) {
      console.error('Swagger 데이터를 가져오는 중 오류 발생:', GetSwaggerApi.error);
    }
  }, [GetSwaggerApi.isSuccess, GetSwaggerApi.data]);



  if (GetSwaggerApi.isLoading) {
    return <div></div>;
  }

  return swaggerData ? (
    <SwaggerUI 
      spec={swaggerData}
      supportedSubmitMethods={[]}
    />
  ) : null;
};

export default SwaggerMain;
