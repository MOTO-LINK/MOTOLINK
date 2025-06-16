import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTg3MzQ3OWQtNDY4Mi00YzU5LTk5MTgtMjI5NDk2OGQ5YjE0IiwiZW1haWwiOiJhaG1lZEB0ZXN0LmNvbSIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3NTAwMDkwNDEsImV4cCI6MTc1MDA5NTQ0MX0.FlkQbgg0hDhB0TbXqQ1Que-xl7CvnZJ9DKzKJqhtnXU"
  },
});

export default axiosInstance;
