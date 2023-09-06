export default function Footer() {
  const d = new Date();
  return (
    <footer className="admin-footer">
      <p>
        © {d.getFullYear()} Tradeshow, all rights reserved
        {/* Terms and Conditions | Privacy Policy */}
      </p>
    </footer>
  );
}
