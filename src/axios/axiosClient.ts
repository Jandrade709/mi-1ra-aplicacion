import axios from "axios";
const axiosClient = axios.create({
    baseURL: "https://chucknorris.io/jokes/",
    headers: {
        "Content-Type": "application/json",
    },
});
export default axiosClient;
