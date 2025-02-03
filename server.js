const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة بيانات MongoDB (استبدل الرابط برابط MongoDB Atlas الخاص بك)
mongoose.connect('mongodb+srv://sido:G5QvR51EGXXCdaaJ@cluster0.o0rq7.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
  .catch(err => console.error("❌ فشل الاتصال بقاعدة البيانات:", err));

// تعريف نموذج الطلبات في قاعدة البيانات
const orderSchema = new mongoose.Schema({
    customerName: String,
    orderDetails: String,
    timestamp: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// إضافة طلب جديد
app.post('/orders', async (req, res) => {
    const { customerName, orderDetails } = req.body;
    const newOrder = new Order({ customerName, orderDetails });
    await newOrder.save();
    res.json({ message: "✅ تم حفظ الطلب", order: newOrder });
});

// جلب جميع الطلبات
app.get('/orders', async (req, res) => {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
});

// تشغيل السيرفر
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`));