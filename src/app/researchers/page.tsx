import styles from "./page.module.css";
import Link from "next/link";

// Mock data (Normally this would come from Prisma DB)
const mockResearchers = [
  {
    id: 1,
    name: "Dr. Somchai",
    position: "Lead Researcher",
    bio: "Expert in Artificial Intelligence and Machine Learning.",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somchai&background=d32f2f&color=fff"
  },
  {
    id: 2,
    name: "Dr. Somsri",
    position: "Senior Data Scientist",
    bio: "Specializing in Natural Language Processing and LLMs.",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Somsri&background=fbc02d&color=000"
  },
  {
    id: 3,
    name: "Dr. Mana",
    position: "Research Engineer",
    bio: "Focuses on scalable architecture and distributed systems.",
    scholarLink: "https://scholar.google.com/",
    imageUrl: "https://ui-avatars.com/api/?name=Mana&background=1976d2&color=fff"
  }
];

export default function Researchers() {
  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.title}>Our Researchers</h1>
        <p className={styles.subtitle}>Meet the brilliant minds behind AIO LAB.</p>
      </section>

      <section className={styles.researchersList}>
        <div className="container">
          <div className={styles.grid}>
            {mockResearchers.map((researcher) => (
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
                        Google Scholar
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
