import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
}) => (
  <div style={{
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f9fafb',
    padding: '40px 20px',
  }}>
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#0A2540',
        padding: '32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#ffffff',
          margin: 0,
          fontSize: '24px',
          fontWeight: '800',
          letterSpacing: '-0.025em',
        }}>
          Pin<span style={{ color: '#FF6B00' }}>Hire</span> India
        </h1>
      </div>

      {/* Body */}
      <div style={{ padding: '40px 32px' }}>
        <h2 style={{
          color: '#111827',
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '16px',
        }}>
          Dear {name},
        </h2>
        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px',
        }}>
          Thank you for choosing PinHire India!
        </p>
        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px',
        }}>
          You are now part of India’s fastest-growing job discovery platform.
        </p>
        <p style={{
          color: '#4b5563',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}>
          With PinHire, you can explore the best job opportunities, use <strong style={{ color: '#0A2540' }}>Smart Match Radar</strong>, and connect with top companies across India. We are excited to help you find your dream job.
        </p>

        <a href="https://pinhire.in/explore" style={{
          display: 'block',
          backgroundColor: '#FF6B00',
          color: '#ffffff',
          textAlign: 'center',
          padding: '16px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '16px',
          boxShadow: '0 4px 6px -1px rgba(255, 107, 0, 0.2)',
          marginBottom: '32px',
        }}>
          Start Exploring Jobs
        </a>

        <p style={{
          marginTop: '32px',
          color: '#4b5563',
          fontSize: '15px',
          lineHeight: '1.6',
        }}>
          Best regards,<br />
          <strong style={{ color: '#0A2540' }}>The PinHire Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '24px 32px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px' }}>
          © 2026 PinHire India. All rights reserved.<br />
          Bengaluru, Karnataka, India
        </p>
      </div>
    </div>
  </div>
);
