import styles from "./page.module.css";

// คุณสามารถเพิ่มหรือแก้ไขข้อมูลนักวิจัยได้โดยตรงที่ตัวแปรนี้ครับ
// เพียงแค่คัดลอก { ... } แล้วเปลี่ยนข้อมูลข้างใน
const researchersData = [
  {
    id: 1,
    name: "ผศ.ดร. สมชาย มุ่งมั่น",
    position: "หัวหน้ากลุ่มวิจัย",
    bio: "ผู้เชี่ยวชาญด้านปัญญาประดิษฐ์ (Artificial Intelligence) และการเรียนรู้ของเครื่อง (Machine Learning)",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somchai&background=d32f2f&color=fff"
  },
  {
    id: 2,
    name: "ดร. สมศรี รักเรียน",
    position: "นักวิจัยอาวุโส",
    bio: "มีความเชี่ยวชาญด้านการประมวลผลภาษาธรรมชาติ (NLP) และโมเดลภาษาขนาดใหญ่ (LLMs)",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somsri&background=fbc02d&color=000"
  },
  {
    id: 3,
    name: "อ. มานะ พัฒนา",
    position: "นักวิจัย",
    bio: "สนใจงานวิจัยทางด้าน Data Science และสถาปัตยกรรมระบบคลาวด์",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Mana&background=1976d2&color=fff"
  }
];

export default function Researchers() {
  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.title}>นักวิจัยของเรา</h1>
        <p className={styles.subtitle}>ทำความรู้จักกับบุคลากรและทีมนักวิจัยแห่ง AIO LAB มหาวิทยาลัยอุบลราชธานี</p>
      </section>

      <section className={styles.researchersList}>
        <div className="container">
          <div className={styles.grid}>
            {researchersData.map((researcher) => (
              <div key={researcher.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={researcher.imageUrl} alt={researcher.name} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.name}>{researcher.name}</h3>
                  <p className={styles.position}>{researcher.position}</p>
                  <p className={styles.bio}>{researcher.bio}</p>
                  
                  <div className={styles.cardFooter}>
                    {researcher.scholarLink && (
                      <a href={researcher.scholarLink} target="_blank" rel="noopener noreferrer" className={styles.scholarLink}>
                        <svg className={styles.scholarIcon} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-2.4a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2zm-.7-7.2h1.4v3.8h-1.4v-3.8zm0-2.2h1.4v1.4h-1.4v-1.4z"/>
                          <path d="M5.5 5.5l6.5-5.5 6.5 5.5v5.5h-13v-5.5zm1.5.7v3.3h10V6.2L12 2.4 7 6.2z"/>
                        </svg>
                        ดูผลงานวิจัยบน Google Scholar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
