export interface Project {
  id: string;
  title: string;
  description: string;
  /** وصف نوع المشروع، مشتق من طبيعته لا من تسويقه. يُعرض بصريًا في 5B.4. */
  category?: string;
  color: string;
  tags: string[];
  link: string;
}
