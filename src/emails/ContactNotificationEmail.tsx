import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

/**
 * قالب إشعار نموذج التواصل — Server-only، بلا "use client" وبلا أي تفاعل.
 *
 * أمان: كل القيم تُعرض كنصوص داخل عناصر React، فالهروب التلقائي يمنع حقن HTML.
 * لا نستخدم dangerouslySetInnerHTML إطلاقًا. أسطر الرسالة تُقسَّم وتُعرض
 * كفقرات منفصلة بدل حقن <br> من نص المستخدم.
 *
 * لا يحتوي البريد: IP ولا User-Agent ولا معرّفات داخلية ولا بيانات حدّ المعدّل.
 */
export function ContactNotificationEmail({ name, email, message, receivedAt }: Props) {
  const lines = message.split("\n");

  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{`طلب مشروع جديد من ${name}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>Mohamed Gamal Portfolio</Text>

          <Heading style={heading}>طلب مشروع جديد</Heading>

          <Hr style={hr} />

          <Section>
            <Text style={label}>الاسم</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>البريد الإلكتروني</Text>
            <Text style={value}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>

            <Text style={label}>تفاصيل المشروع</Text>
            {lines.map((line, i) => (
              <Text key={i} style={value}>
                {line === "" ? " " : line}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>وصلت في {receivedAt} — من نموذج التواصل في mohamedjimmy.com</Text>

          <Text style={footer}>
            <Link href={`mailto:${email}`} style={link}>
              الرد على العميل
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactNotificationEmail;

/* أنماط مضمّنة — عملاء البريد لا يعتمدون على أوراق أنماط خارجية */
const body = {
  backgroundColor: "#f5f6f8",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif",
  margin: "0",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "28px",
};

const brand = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1px",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 8px",
};

const hr = { border: "none", borderTop: "1px solid #e5e7eb", margin: "20px 0" };

const label = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  margin: "16px 0 4px",
  textTransform: "uppercase" as const,
};

const value = {
  color: "#111827",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
};

const link = { color: "#2563eb", textDecoration: "underline" };

const footer = { color: "#6b7280", fontSize: "12px", margin: "8px 0 0" };
