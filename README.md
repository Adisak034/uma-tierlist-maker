# Uma Musume Tier List Maker (เว็บจัดอันดับตัวละคร ชุด และการ์ดซัพพอร์ต)

เว็บแอปพลิเคชันสร้าง Tier List สำหรับเกม **Uma Musume: Pretty Derby** ขับเคลื่อนโดย API จาก [umapyoi.net](https://umapyoi.net/)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **รองรับครบ 3 หมวดหมู่**:
   - 🏇 **ตัวละคร (Characters)**: 173 ม้าสาว พร้อมชื่ออังกฤษ/ญี่ปุ่น
   - 👗 **ชุดตัวละคร (Outfits / Costumes)**: 266 ร่าง/ชุดคอสตูม พร้อมชื่อชุดและรูปภาพคอสตูม
   - 🎴 **การ์ดซัพพอร์ต (Support Cards)**: 557 ใบ พร้อมแสดง Rarity (SSR / SR / R)
2. **ระบบจัดการ Tier List เต็มรูปแบบ**:
   - ลากและวาง (Drag & Drop) ได้อย่างลื่นไหลด้วย SortableJS
   - รองรับการแตะคลิกเพื่อย้าย (Click-to-Move) เหมาะสำหรับมือถือหรือโน้ตบุ๊ก
   - เพิ่มแถว Tier ใหม่, ลบแถว, เลื่อนตำแหน่งขึ้น/ลง (Move Up/Down), ล้างการ์ดในแถว (Clear Tier)
   - ปรับแต่งชื่อแถวและสีของ Tier ได้อิสระ พร้อมจานสีพรีเซ็ตและ Color Picker
   - ปรับขนาดการ์ดได้ (Zoom Slider: ขนาดเล็ก / กลาง / ใหญ่)
3. **ระบบค้นหาและตัวกรอง (Search & Filter)**:
   - ค้นหาแบบเรียลไทม์ตามชื่อ EN, JP หรือชื่อการ์ด/ชุด
   - ฟิลเตอร์ตามระดับ Rarity (SSR, SR, R)
   - ฟิลเตอร์ตามตัวละคร (เลือกดูเฉพาะการ์ดหรือชุดของม้าสาวที่ต้องการ)
   - ซ่อน/แสดงป้ายชื่อใต้รูปการ์ด
4. **ส่งออกรูปภาพ & บันทึกงาน**:
   - **Export as Image (PNG)**: บันทึกรูปภาพความละเอียดสูงสำหรับแชร์ลง Facebook, X (Twitter), หรือ Discord
   - **Copy to Clipboard**: คัดลอกรูปลงคลิปบอร์ดได้ทันที
   - **Save / Load JSON**: บันทึก Tier List เก็บเป็นไฟล์ และนำกลับมาเปิดทำต่อได้
   - **Auto-Save**: บันทึกข้อมูลลงใน LocalStorage ของเบราว์เซอร์อัตโนมัติ ไม่ต้องกลัวข้อมูลหายเมื่อรีเฟรช
5. **ความเสถียร & ทำงานแบบ Offline ได้**:
   - มีชุดข้อมูล Bundled Cache ในตัว เปิดใช้งานได้ทันทีแบบ Zero-Latency
   - ดับเบิ้ลคลิกไฟล์ `index.html` เพื่อเปิดใช้งานได้ทันที หรือรันผ่าน `start.bat` / `npm start`
   - มีปุ่ม **"🔄 Sync API"** เพื่อดึงข้อมูลอัปเดตล่าสุดจาก `https://umapyoi.net/`

---

## 🚀 วิธีเปิดใช้งาน (How to Run)

### วิธีที่ 1: รันผ่าน Node.js (แนะนำ)
เปิด Terminal หรือ Command Prompt ในโฟลเดอร์นี้ แล้วพิมพ์:
```bash
npm start
```
หรือ
```bash
node server.js
```
ระบบจะเปิดเบราว์เซอร์ไปที่ `http://localhost:3000/index.html` ให้โดยอัตโนมัติ

### วิธีที่ 2: ดับเบิ้ลคลิก start.bat
- ดับเบิ้ลคลิกที่ไฟล์ **`start.bat`** เพื่อเปิดเซิร์ฟเวอร์ Node.js ได้ทันที

### วิธีที่ 3: ดับเบิ้ลคลิก index.html เปิดทันที
- ดับเบิ้ลคลิกที่ไฟล์ **`index.html`** ในโฟลเดอร์นี้เพื่อเปิดบน Google Chrome, Microsoft Edge, หรือเบราว์เซอร์ใดก็ได้ทันที (ทำงานได้ครบถ้วนโดยไม่ต้องเปิดเซิร์ฟเวอร์)

---

## 🌐 วิธีนำขึ้น GitHub Pages (Deploy to GitHub Pages)

โปรเจกต์นี้ได้รับการออกแบบเป็น Client-Side SPA อย่างสมบูรณ์ จึงสามารถรันบน GitHub Pages ได้ฟรี 100%:

### วิธีอัปโหลดผ่านหน้าเว็บ GitHub (ง่ายที่สุด):
1. ไปที่ [GitHub](https://github.com/) แล้วสร้าง Repository ใหม่ (ตั้งชื่อเช่น `uma-tierlist-maker` และเลือก **Public**)
2. ในหน้า Repo ให้กดคลิกที่ **"uploading an existing file"**
3. ลากไฟล์และโฟลเดอร์ทั้งหมด (`index.html`, `styles.css`, `app.js`, `api.js`, `data/`, `libs/`, `.nojekyll`, ฯลฯ) วางลงในช่องอัปโหลด แล้วกด **Commit changes**
4. ไปที่แท็บ **Settings** ของ Repository -> เลือกเมนู **Pages** ทางซ้ายมือ
5. ในหัวข้อ **Build and deployment**:
   - **Source**: เลือก **Deploy from a branch**
   - **Branch**: เลือก **`main`** และโฟลเดอร์ **`/(root)`** แล้วกดปุ่ม **Save**
   *(หรือเลือก Source เป็น **GitHub Actions** ก็ได้ เนื่องจากมีไฟล์ `.github/workflows/deploy.yml` รองรับแล้ว)*
6. รอประมาณ 1-2 นาที คุณจะได้ URL เว็บไซต์ เช่น:
   `https://<your-username>.github.io/uma-tierlist-maker/`
   สามารถนำลิงก์ไปแชร์ให้เพื่อนเล่นได้ทันที!


---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
uma tiealist maker/
├── package.json          # Node.js configuration & scripts
├── server.js             # Local HTTP Server (Node.js)
├── fetch_data.js         # สคริปต์ดาวน์โหลดข้อมูล API (Node.js)
├── start.bat             # Windows auto-starter (Node.js)
├── index.html            # หน้าเว็บหลัก (HTML5 SPA)
├── styles.css            # ไฟล์ตกแต่งสไตล์ Uma Musume Dark & Gold Theme
├── app.js                # ตรรกะการทำงานของ Tier List, Drag & Drop, Search, Export
├── api.js                # โมดูลเชื่อมต่อ Umapyoi.net API และระบบ Caching
├── data/
│   ├── characters.json   # ข้อมูลตัวละคร 173 ตัว
│   ├── outfits.json      # ข้อมูลชุดตัวละคร 266 ชุด
│   ├── supports.json     # ข้อมูลการ์ดซัพพอร์ต 557 ใบ
│   └── data.js           # JavaScript bundle สำหรับเปิดแบบ Offline / file://
└── libs/
    ├── sortable.min.js   # ไลบรารี Drag & Drop
    └── html2canvas.min.js# ไลบรารี Export รูปภาพความละเอียดสูง
```

---

## 🔄 วิธีอัปเดตข้อมูลเมื่อมีตัวละครหรือการ์ดใหม่เข้ามา

หากเกมมีอัปเดตตู้กาชาใหม่ ม้าสาวตัวใหม่ หรือการ์ดซัพพอร์ตใหม่ สามารถอัปเดตได้ถึง **3 วิธี**:

### วิธีที่ 1: อัปเดตทันทีผ่านหน้าเว็บ (สำหรับผู้ใช้งานทั่วไป)
- กดปุ่ม **"🔄 Sync API"** ที่มุมขวาบนของหน้าเว็บ ระบบจะยิงตรงไปดึงข้อมูลใหม่ล่าสุดจาก `umapyoi.net` แล้วนำม้าสาวหรือการ์ดใหม่เข้ามาแสดงในคลังทันที!
- นอกจากนี้ ตัวเว็บยังมีระบบ **Silent Background Check** เมื่อเปิดเว็บ จะเช็คข้อมูลใหม่ให้เบื้องหลังอัตโนมัติ

### วิธีที่ 2: อัปเดตไฟล์ในเครื่อง (สำหรับผู้พัฒนา)
เปิด Terminal ในโฟลเดอร์นี้ แล้วรันคำสั่ง:
```bash
npm run fetch-data
```
สคริปต์จะดาวน์โหลดข้อมูลล่าสุดทั้งหมด แล้วอัปเดตไฟล์ในโฟลเดอร์ `data/` ให้โดยอัตโนมัติภายใน 5-10 วินาที จากนั้นเพียงดันโค้ดขึ้น GitHub ก็เสร็จสิ้น

### วิธีที่ 3: อัตโนมัติ 100% ผ่าน GitHub Actions (ตั้งค่าไว้แล้ว)
- ใน Repository มีไฟล์ `.github/workflows/update-data.yml` ซึ่งจะรันดึงข้อมูลจาก `umapyoi.net` ให้โดยอัตโนมัติทุกสัปดาห์ (ทุกวันจันทร์)
- หรือสามารถไปที่แท็บ **Actions** บน GitHub -> เลือก **Auto-Update Uma Data from Umapyoi.net** -> กดปุ่ม **Run workflow** เพื่อให้อัปเดตและ Deploy ทันทีได้ทุกเมื่อ!

---

## 📜 การอ้างอิงข้อมูล (Attribution)
- Data provided by [umapyoi.net](https://umapyoi.net/)
- Character & Support Card assets referenced via [GameTora](https://gametora.com/umamusume)
- Uma Musume: Pretty Derby is a registered trademark of Cygames, Inc.

