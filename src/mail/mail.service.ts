import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html: `<h1>${subject}</h1><p>${text}</p>`,
      });
      return { message: `Mail sent successfully to ${to}` };
    } catch (error) {
      console.error('Mail sending error:', error);
      return { error: `Failed to send mail: ${error.message}` };
    }
  }

  async sendAdminWelcomeEmail(adminData: {
    email: string;
    fullName: string;
    position?: string;
    department?: { name: string; building?: string };
  }) {
    try {
      const subject = '🎉 Welcome to Bus Reservation System - Admin Access';
      
      const departmentInfo = adminData.department 
        ? `<p><strong>Department:</strong> ${adminData.department.name}${adminData.department.building ? ` (${adminData.department.building})` : ''}</p>`
        : '';

      const positionInfo = adminData.position 
        ? `<p><strong>Position:</strong> ${adminData.position}</p>`
        : '';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🚌 Bus Reservation</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Admin Portal Access</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${adminData.fullName}! 🎉</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Congratulations! Your admin account has been successfully created in the Bus Reservation System.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0;">👤 Admin Details:</h3>
              <p><strong>Full Name:</strong> ${adminData.fullName}</p>
              <p><strong>Email:</strong> ${adminData.email}</p>
              ${positionInfo}
              ${departmentInfo}
            </div>

            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">🔑 Admin Privileges:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>✅ Manage all user accounts and registrations</li>
                <li>✅ Oversee bus schedules and bookings</li>
                <li>✅ Access comprehensive system analytics</li>
                <li>✅ Manage department operations</li>
                <li>✅ Generate reports and statistics</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Ready to start managing the system?</p>
              <a href="http://localhost:3000/admin/login" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                🚀 Access Admin Portal
              </a>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>🔒 Security Note:</strong> Please keep your login credentials secure and do not share them with unauthorized personnel.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee;">
            <p style="margin: 0;">
              🏫 <strong>American International University-Bangladesh (AIUB)</strong><br>
              Bus Reservation System | Admin Portal<br>
              <em>Streamlining campus transportation</em>
            </p>
          </div>
        </div>
      `;

      await this.mailerService.sendMail({
        to: adminData.email,
        subject,
        html,
      });

      return { 
        success: true, 
        message: `Admin welcome email sent successfully to ${adminData.email}` 
      };
    } catch (error) {
      console.error('Admin welcome email error:', error);
      return { 
        success: false, 
        error: `Failed to send admin welcome email: ${error.message}` 
      };
    }
  }

  async sendUserWelcomeEmail(userData: {
    email: string;
    fullName: string;
    phone?: string;
    gender?: string;
  }) {
    try {
      const subject = '🎉 Welcome to Bus Reservation System';
      
      const genderEmoji = userData.gender === 'male' ? '👨‍🎓' : userData.gender === 'female' ? '👩‍🎓' : '🎓';
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🚌 Bus Reservation</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Student Portal</h2>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${userData.fullName}! ${genderEmoji}</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Congratulations! Your account has been successfully created in the Bus Reservation System. 
              You can now book bus seats, track schedules, and manage your transportation needs effortlessly.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <h3 style="color: #4CAF50; margin-top: 0;">👤 Your Account Details:</h3>
              <p><strong>Full Name:</strong> ${userData.fullName}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
              ${userData.phone ? `<p><strong>Phone:</strong> ${userData.phone}</p>` : ''}
              ${userData.gender ? `<p><strong>Gender:</strong> ${userData.gender === 'male' ? 'Male 👨‍🎓' : userData.gender === 'female' ? 'Female 👩‍🎓' : userData.gender}</p>` : ''}
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">🎯 What You Can Do:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🚌 <strong>Book Bus Seats:</strong> Reserve your preferred seats in advance</li>
                <li>📅 <strong>View Schedules:</strong> Check real-time bus timings and routes</li>
                <li>📍 <strong>Track Routes:</strong> Monitor bus locations and arrival times</li>
                <li>📊 <strong>Booking History:</strong> View your past and upcoming bookings</li>
                <li>👤 <strong>Manage Profile:</strong> Update your personal information</li>
                <li>💳 <strong>Payment Options:</strong> Multiple secure payment methods</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Ready to start your journey?</p>
              <a href="http://localhost:3000/user/login" 
                 style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                🚀 Start Booking Now
              </a>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Book your seats early during peak hours and exam periods for better availability!
              </p>
            </div>

            <div style="background: #e3f2fd; border: 1px solid #bbdefb; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="color: #1565c0; margin: 0; font-size: 14px;">
                <strong>📱 Mobile Friendly:</strong> Access the system from any device - phone, tablet, or computer!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee;">
            <p style="margin: 0;">
              🏫 <strong>American International University-Bangladesh (AIUB)</strong><br>
              Bus Reservation System | Student Portal<br>
              <em>Making campus transportation easier for everyone</em>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
              📧 Need help? Contact support | 🌐 Visit our website
            </p>
          </div>
        </div>
      `;

      await this.mailerService.sendMail({
        to: userData.email,
        subject,
        html,
      });

      return { 
        success: true, 
        message: `User welcome email sent successfully to ${userData.email}` 
      };
    } catch (error) {
      console.error('User welcome email error:', error);
      return { 
        success: false, 
        error: `Failed to send user welcome email: ${error.message}` 
      };
    }
  }
}
