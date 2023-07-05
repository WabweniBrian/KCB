import AddClubForm from "@/components/clubs/AddClubForm";
import AddEventForm from "@/components/events/AddEventsForm";
import AddFamilyForm from "@/components/family/AddFamilyForm";
import AddPostForm from "@/components/posts/AddPostForm";
import AddSlideForm from "@/components/slides/AddSlideForm";
import AddSubjectForm from "@/components/subjects/AddSubjectForm";
import AddUnebStatsForm from "@/components/uneb/AddUnebStatsForm";

export default function Home() {
  return (
    <div className="max-w-6xl my-10 mx-auto px-8">
      <AddSlideForm />
    </div>
  );
}
