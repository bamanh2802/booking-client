import { API_PATH } from "./apiPath";
import axios from "axios";

export const getNotifications = async () => {
    const response = await axios.get(`${API_PATH}/notification`, {
        withCredentials: true,
    });
    
    return response.data;
    }

export const markNotificationAsRead = async (notificationId: string) => {
    const response = await axios.patch(
        `${API_PATH}/notification/${notificationId}`,
        {},
        {
            withCredentials: true,
        },
    );

    return response.data;
}