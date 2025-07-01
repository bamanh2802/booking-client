"use client";

import { useState, useEffect, Fragment } from "react";
import { useSocket } from "@/contexts/SocketContext";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/services/notification";
import { Notification } from "@/types";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon, EnvelopeIcon } from "@heroicons/react/24/outline"; // Dùng outline icons
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import clsx from "clsx"; // Thư viện tiện ích để nối class có điều kiện

// Component con hiển thị một dòng thông báo
const NotificationItem = ({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) => {
  const handleItemClick = () => {
    if (!notification.isRead) {
      onMarkRead(notification._id);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={clsx(
        "flex items-start p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150",
        !notification.isRead && "bg-blue-50"
      )}
    >
      <div className="flex-shrink-0 mr-3 mt-1">
        <EnvelopeIcon className="h-6 w-6 text-gray-500" />
      </div>
      <div className="flex-1">
        <p
          className={clsx(
            "text-sm font-medium text-gray-900",
            !notification.isRead && "font-bold"
          )}
        >
          {notification.title}
        </p>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="text-xs text-blue-600 mt-1">
          {notification.createdAt
            ? formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: vi,
              })
            : "Vừa xong"}
        </p>
      </div>
      {!notification.isRead && (
        <div className="flex-shrink-0 ml-2 mt-1">
          <span className="h-2 w-2 rounded-full bg-blue-500 block"></span>
        </div>
      )}
    </div>
  );
};

export const NotificationBell = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true); // Bắt đầu với loading=true

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data.data.results);
        const initialUnread = data.data.results.filter(
          (n: any) => !n.isRead
        ).length;
        setUnreadCount(initialUnread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
      if (!newNotification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket]);

  const handleMarkAsRead = async (id: string) => {
    const notification = notifications.find((n) => n._id === id);
    if (!notification || notification.isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
      );
      setUnreadCount((prev) => prev + 1);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">Open notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">Thông báo</p>
          </div>
          <div className="py-1 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-10">Đang tải...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Menu.Item key={notification._id || `notification-${index}`}>
                  {({ active }) => (
                    <NotificationItem
                      notification={notification}
                      onMarkRead={() => handleMarkAsRead(notification._id)}
                    />
                  )}
                </Menu.Item>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                Không có thông báo mới.
              </p>
            )}
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              <Link
                href="/notifications"
                className="block w-full text-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 rounded-md"
              >
                Xem tất cả
              </Link>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
