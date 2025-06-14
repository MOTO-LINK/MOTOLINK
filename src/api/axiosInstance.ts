import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"http://motolinkapp-env.eba-vwaaqaqm.eu-central-1.elasticbeanstalk.com/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTg3MzQ3OWQtNDY4Mi00YzU5LTk5MTgtMjI5NDk2OGQ5YjE0IiwiZW1haWwiOiJhaG1lZEB0ZXN0LmNvbSIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3NDk4NTYzMDIsImV4cCI6MTc0OTk0MjcwMn0.0rolpTu0JNDZiaRmz1l7RC6wIe9hP8XSlFm4axkFIPE"
  },
});

export default axiosInstance;
// https://virtserver.swaggerhub.com/motolink-505/MotolinkAPI/1.0