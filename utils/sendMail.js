import sgMail from '@sendgrid/mail'
export const sendEmail = async (receiver, subject, templateId, dynamicTemplateData) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API)
    const data = {
      to: receiver,
      from: process.env.EMAIL_FROM,
      subject,
      templateId,
      dynamicTemplateData
    }
    return sgMail.send(data)
  } catch (error) {
    return error
  }
}