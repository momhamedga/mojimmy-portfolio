"use server"

export async function submitContactForm(formData: FormData) {
  // 1. استخراج البيانات والتأكد منها
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const access_key = "b02db0d8-32b5-41cc-b422-6bc4440cdcd5";

  // تأكد إن البيانات مش فاضية قبل ما نبعت
  if (!name || !email || !message) {
    return { success: false, message: "بيانات ناقصة" };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // تحويل البيانات لـ JSON صريح
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        access_key: access_key,
        from_name: "موقعك الشخصي",
        subject: "رسالة جديدة من نموذج الاتصال"
      }),
    });

    // جلب النص الخام أولاً للتأكد إنه مش HTML
    const text = await response.text();
    
    try {
      const result = JSON.parse(text);
      return result; // هيرجع { success: true }
    } catch (parseError) {
      console.error("الرد ليس JSON:", text);
      return { success: false, error: "الرد من السيرفر غير متوقع" };
    }

  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "فشل الاتصال بالسيرفر" };
  }
}