import { Topic } from "./types";

export const PASSING_GRADE = 60;

export const TOPICS: Topic[] = [
  {
    id: "etika-hukum",
    name: "Etika & Hukum Keperawatan",
    description: "Kodeks etik PPNI, informed consent, malpractice, hak pasien",
  },
  {
    id: "asuhan-dasar",
    name: "Asuhan Keperawatan Dasar",
    description: "Vital signs, hygiene, mobilisasi, nutrisi, eliminasi, istirahat",
  },
  {
    id: "mkb",
    name: "Keperawatan Medikal Bedah",
    description: "Sistem kardiovaskuler, respirasi, neurologi, GI, muskuloskeletal",
  },
  {
    id: "maternitas",
    name: "Keperawatan Maternitas",
    description: "Asuhan persalinan, postpartum, KB, komplikasi obstetri",
  },
  {
    id: "anak",
    name: "Keperawatan Anak",
    description: "Tumbuh kembang, IMCI, neonatal care, penyakit anak",
  },
  {
    id: "jiwa",
    name: "Keperawatan Jiwa",
    description: "Gangguan jiwa, komunikasi terapeutik, intervensi krisis",
  },
  {
    id: "gadar",
    name: "Keperawatan Gawat Darurat & Kritis",
    description: "Triage, BLS/ACLS, trauma, shock, disaster management",
  },
  {
    id: "komunitas",
    name: "Keperawatan Komunitas",
    description: "Promosi kesehatan, pencegahan penyakit, epidemiologi, keluarga",
  },
];

export const MAX_QUESTIONS = 50;
export const DEFAULT_QUESTION_COUNT = 10;
export const TIME_PER_QUESTION = 90; // seconds
