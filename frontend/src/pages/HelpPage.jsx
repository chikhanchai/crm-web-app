import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, LayoutDashboard, Building, PhoneCall, Handshake, CreditCard, Network, Users } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-800"><ArrowLeft size={20} /></Link>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <BookOpen size={24} /> CRM System Help & Guide
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">คู่มือการใช้งานระบบ (Help Manual)</h1>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" /> 1. หน้า Dashboard
            </h2>
            <p className="text-gray-600 mb-2">หน้าจอหลักสำหรับค้นหาและดูภาพรวมของลูกค้าทั้งหมด</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li><strong>Filter / Search:</strong> สามารถค้นหาตามชื่อบริษัท และกรองข้อมูลตาม Industry, BU, AE, หรือ Focus Tier ได้</li>
              <li><strong>Summary View:</strong> มุมมองตารางแบบสรุปย่อ แสดงข้อมูลหลักๆ</li>
              <li><strong>Excel View:</strong> มุมมองตารางแบบเต็ม คล้าย Excel สามารถกดเรียงลำดับ (Sort) โดยคลิกที่ชื่อคอลัมน์ด้านบน</li>
              <li><strong>Export to Excel:</strong> ดาวน์โหลดข้อมูลที่กำลังแสดงผลบนหน้าจอ ออกมาเป็นไฟล์ .xlsx ทันที</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Building className="text-blue-600" /> 2. แท็บ Overview & Contact (ข้อมูลทั่วไป)
            </h2>
            <p className="text-gray-600 mb-2">เก็บข้อมูลโปรไฟล์พื้นฐานและช่องทางการติดต่อของลูกค้า</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>ใช้สำหรับบันทึกข้อมูลทั่วไป เช่น เลขผู้เสียภาษี (Tax ID), Focus Tier, ทุนจดทะเบียน และรายได้ล่าสุด</li>
              <li>รวมไปถึงช่องทาง Social Media และรายละเอียดผู้มีอำนาจตัดสินใจ (Decision Maker)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <PhoneCall className="text-blue-600" /> 3. แท็บ Activity Log (ประวัติการติดต่อ)
            </h2>
            <p className="text-gray-600 mb-2">ระบบบันทึกประวัติการพูดคุยกับลูกค้า (Sales Activities)</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>บันทึกวันเวลาที่เข้าพบ (Meeting), โทรศัพท์ (Call) หรือ ส่งอีเมล (Email)</li>
              <li>ใส่จดบันทึก (Notes) และระบุ Next Action (สิ่งที่ต้องทำต่อไป) พร้อมวันที่กำหนด (Due date)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Handshake className="text-blue-600" /> 4. แท็บ Opportunities (ดีลการขาย)
            </h2>
            <p className="text-gray-600 mb-2">ติดตามสถานะความคืบหน้าของดีล หรือไปป์ไลน์การขาย (Sales Pipeline)</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>สามารถเพิ่มโอกาสการขายใหม่ๆ แยกตามประเภทบริการ เช่น SD-WAN, Cloud, Cybersecurity ฯลฯ</li>
              <li>ระบุมูลค่าที่คาดว่าจะปิดการขายได้ (Est. Deal Value) และสถานะ (Stage) เช่น Prospecting, Proposal, Closed Won</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="text-blue-600" /> 5. แท็บ Share of Wallet (ข้อมูลคู่แข่ง / การใช้งาน IT ปัจจุบัน)
            </h2>
            <p className="text-gray-600 mb-2">บันทึกข้อมูลการใช้บริการ IT ในปัจจุบันของลูกค้า ว่าใช้งานเจ้าไหนอยู่ และจ่ายเงินเท่าไหร่</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>ช่วยให้เห็นภาพรวมว่า คู่แข่ง (Competitor) เจ้าไหนกินส่วนแบ่ง (Wallet) ของลูกค้ารายนี้อยู่บ้าง</li>
              <li>สามารถจดบันทึก วันหมดสัญญา (Contract Expiry) เพื่อใช้วางแผนเข้าไปแย่งยอดขายกลับมา</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Network className="text-blue-600" /> 6. แท็บ Ecosystem Synergies (โอกาส Cross-sell)
            </h2>
            <p className="text-gray-600 mb-2">โอกาสการขายร่วมกับบริษัทในเครือ (Synergy)</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>เช่น การขายบริการร่วมกับ Egg Digital (Data/Ads), True IDC (Cloud/Colocation), TDG (IoT/Analytics) และ Greenmoons (RPA)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="text-blue-600" /> 7. ระบบจัดการผู้ใช้ (User Management)
            </h2>
            <p className="text-gray-600 mb-2">สำหรับผู้ดูแลระบบ (Admin) เท่านั้น</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
              <li>ใช้สำหรับ เพิ่ม/ลด/แก้ไข สิทธิ์การเข้าใช้งานของทีม Sales (AE) และ Business Unit (BU) ต่างๆ</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
