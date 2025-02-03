// تعريف مكتبة Socket.IO
const { Server } = require('socket.io');
const { server } = require('../server');

// إنشاء Socket.IO server
const io = new Server(server, { cors: { origin: "*" } });
exports.io = io;

// **📌 الاتصال بـ Socket.IO من جانب العميل**
const socket = io(); // هذا يجب أن يكون في ملف العميل (Frontend)

// **📌 إرسال طلب جديد إلى السيرفر**
document.getElementById("orderForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const orderDetails = document.getElementById("orderDetails").value;

    const response = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, orderDetails })
    });

    if (response.ok) {
        document.getElementById("customerName").value = "";
        document.getElementById("orderDetails").value = "";
    }
});

// **📌 تحميل الطلبات من قاعدة البيانات عند فتح الصفحة**
async function loadOrders() {
    const response = await fetch("/orders");
    const orders = await response.json();

    const orderList = document.getElementById("orderList");
    orderList.innerHTML = "";
    orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `${order.customerName}: ${order.orderDetails}`;
        orderList.appendChild(li);
    });
}

// **📌 تحديث الطلبات عند وصول طلب جديد**
socket.on("newOrder", (order) => {
    const orderList = document.getElementById("orderList");
    const li = document.createElement("li");
    li.textContent = `${order.customerName}: ${order.orderDetails}`;
    orderList.prepend(li);
});

// **📌 تحميل الطلبات عند تشغيل الصفحة**
loadOrders();