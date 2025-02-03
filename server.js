const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 27017;
app.use(express.json());
app.use(cors());

let orders = []; // قائمة الطلبات المخزنة مؤقتًا

// استقبال طلب جديد
app.post("/order", (req, res) => {
    const { customer, details } = req.body;
    if (!customer || !details) {
        return res.status(400).json({ message: "يرجى إدخال جميع البيانات" });
    }
    const order = { id: orders.length + 1, customer, details, status: "قيد المعالجة" };
    orders.push(order);

    // إرسال إشعار فوري لكل الأجهزة المتصلة
    io.emit("newOrder", order);

    console.log("📩 طلب جديد:", order);
    res.status(201).json({ message: "تم استلام الطلب بنجاح", order });
});

// عرض جميع الطلبات
app.get("/orders", (req, res) => {
    res.json(orders);
});

// تشغيل السيرفر
server.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});
