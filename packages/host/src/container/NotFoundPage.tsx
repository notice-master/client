import React from 'react';
import { useParams } from 'react-router-dom';

const NotFoundPage = () => {
  const params = useParams();
  return <div>页面未找到</div>;
};
export default NotFoundPage;
