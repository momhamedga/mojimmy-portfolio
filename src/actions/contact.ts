"use server"

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubmitResult {
  success: boolean;
  message?: string;
}

export async function submitContactForm(formData: FormData): Promise<SubmitResult> {
  // حقل فخ للبوتات (honeypot) — مخفي عن المستخدم الحقيقي، أي قيمة فيه تعني إرسال آلي
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { success: true };
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = formData.get("subject");

  if (
    typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
    name.trim().length < 2 || name.length > 100 ||
    !EMAIL_PATTERN.test(email) || email.length > 200 ||
    message.trim().length < 10 || message.length > 3000
  ) {
    return { success: false, message: "بيانات غير صحيحة، من فضلك راجع الحقول" };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error("WEB3FORMS_ACCESS_KEY غير معرّف في environment variables");
    return { success: false, message: "الخدمة غير متاحة حالياً، حاول لاحقاً" };
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        from_name: "موقعك الشخصي",
        subject: typeof subject === "string" && subject.length > 0 ? subject : "رسالة جديدة من نموذج الاتصال",
      }),
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text);
      return result;
    } catch {
      console.error("الرد ليس JSON:", text);
      return { success: false, message: "الرد من السيرفر غير متوقع" };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, message: "فشل الاتصال بالسيرفر" };
  }
}
