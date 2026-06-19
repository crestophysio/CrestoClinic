import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import Doctor from "@/models/Doctor";
import Service from "@/models/Service";
import Review from "@/models/Review";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import Gallery from "@/models/Gallery";

export async function seedDatabase() {
  await connectToDatabase();

  // 1. Settings Seeding
  let settings = await ClinicSettings.findOne();
  if (!settings) {
    settings = await ClinicSettings.create({
      clinicName: "Cresto Physiotherapy Clinic",
      tagline: "Expert Physiotherapy & Rehabilitation Care in Bengaluru",
      address: "No.70/1, Benaka Plaza, Central Excise House Building Co-operative Society, Doddakammanahalli, Bannerghatta Road, Begur Hobli, Bengaluru",
      phone: "+91 98765 43210",
      email: "info@crestophysio.com",
      whatsapp: "+91 98765 43210",
      mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.5946!3d12.8973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b0a0a0a0a0a%3A0x0!2sBannerghatta+Road%2C+Bengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
      seoTitle: "Cresto Physiotherapy Clinic - Expert Physio & Rehabilitation in Bengaluru",
      seoDescription: "Cresto Physiotherapy Clinic provides advanced physiotherapy, manual therapy, neurological rehabilitation and sports injury treatment in Bengaluru.",
      seoKeywords: "physiotherapy, rehabilitation, manual therapy, sports injury, neuro physio, Bengaluru, Bannerghatta Road",
    });
  }

  // 2. Doctors Seeding
  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    await Doctor.create([
      {
        name: "Dr. Farhan",
        qualification: "MPT, CMT, CDNT, FIMT, CKTT, KSPT",
        specialization: "Senior Physiotherapist & Manual Therapy Expert",
        experience: 10,
        description: "Dr. Farhan is a highly qualified physiotherapist with expertise in manual therapy, dry needling, and advanced rehabilitation techniques. He brings a holistic approach to patient recovery.",
        consultingTime: "Mon - Sat: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
        phone: "+91 98765 43210",
        availability: "Available Today",
      },
      {
        name: "Dr. Jeba",
        qualification: "BPT, MPT (Neuro)",
        specialization: "Neurological Physiotherapist",
        experience: 7,
        description: "Dr. Jeba specialises in neurological rehabilitation, helping patients with stroke, Parkinson's, and spinal cord conditions recover mobility and independence through evidence-based therapy.",
        consultingTime: "Mon - Sat: 9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
        phone: "+91 98765 43211",
        availability: "Available Today",
      },
      {
        name: "Dr. Afreen",
        qualification: "BPT",
        specialization: "Physiotherapist",
        experience: 3,
        description: "Dr. Afreen is a dedicated physiotherapist providing personalised rehabilitation programs for musculoskeletal and post-surgical patients with compassionate care.",
        consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
        phone: "+91 98765 43212",
        availability: "Available Today",
      },
      {
        name: "Dr. Shusmita",
        qualification: "BPT",
        specialization: "Physiotherapist",
        experience: 2,
        description: "Dr. Shusmita brings energy and dedication to physiotherapy care, focusing on pain management, posture correction, and functional recovery for patients of all ages.",
        consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
        phone: "+91 98765 43213",
        availability: "Available Today",
      },
      {
        name: "Dr. Gouri",
        qualification: "BPT",
        specialization: "Physiotherapist",
        experience: 2,
        description: "Dr. Gouri specialises in therapeutic exercises, electrotherapy, and orthopaedic physiotherapy, helping patients regain strength, flexibility, and quality of life.",
        consultingTime: "Mon - Sat: 9:00 AM - 7:00 PM",
        phone: "+91 98765 43214",
        availability: "Available Today",
      },
    ]);
  }

  // 3. Services Seeding
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.create([
      {
        title: "Manual Therapy",
        description: "Hands-on techniques to reduce pain, restore joint mobility, and improve soft tissue flexibility for faster recovery.",
        icon: "Activity",
      },
      {
        title: "Neurological Rehabilitation",
        description: "Specialised programs for stroke, Parkinson's, spinal cord injury, and other neurological conditions to restore function.",
        icon: "Shield",
      },
      {
        title: "Sports Injury Treatment",
        description: "Targeted rehabilitation for athletes — ligament tears, muscle strains, joint pain, and return-to-sport conditioning.",
        icon: "Award",
      },
      {
        title: "Post-Surgical Rehab",
        description: "Structured recovery plans following orthopaedic surgeries including knee replacement, hip surgeries, and spinal procedures.",
        icon: "Heart",
      },
      {
        title: "Electrotherapy",
        description: "Advanced electrotherapy modalities (TENS, IFT, Ultrasound) for pain relief, muscle stimulation, and tissue healing.",
        icon: "Zap",
      },
      {
        title: "Posture & Spine Care",
        description: "Corrective exercises and therapy for back pain, neck pain, scoliosis, and posture-related musculoskeletal disorders.",
        icon: "Compass",
      },
    ]);
  }

  // 4. Testimonials Seeding
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    await Review.create([
      {
        name: "Ramesh Kumar",
        rating: 5,
        reviewText: "Excellent physiotherapy centre! Dr. Farhan's manual therapy sessions have completely resolved my chronic back pain. Very professional and caring team.",
        approved: true,
      },
      {
        name: "Priya Sharma",
        rating: 5,
        reviewText: "Dr. Jeba is outstanding. After my stroke, her neurological rehab program helped me regain my walking ability. Forever grateful to Cresto Physiotherapy.",
        approved: true,
      },
      {
        name: "Arun Nair",
        rating: 5,
        reviewText: "Recovered from my ACL surgery much faster than expected, thanks to the post-surgical rehab program. Highly recommend Cresto for sports injury treatment.",
        approved: true,
      },
    ]);
  }

  // 5. FAQs Seeding
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.create([
      {
        question: "What are the clinic timings?",
        answer: "Cresto Physiotherapy Clinic is open Monday to Saturday, 9:00 AM to 7:00 PM. We are closed on Sundays.",
      },
      {
        question: "How do I book an appointment?",
        answer: "You can book directly using our online booking form, WhatsApp us, or call the clinic directly. Walk-ins are also welcome subject to availability.",
      },
      {
        question: "How many sessions will I need?",
        answer: "The number of sessions depends on your condition and recovery goals. Your physiotherapist will assess you on the first visit and create a customised treatment plan.",
      },
      {
        question: "Is parking available near the clinic?",
        answer: "Yes, Benaka Plaza has parking available for both two-wheelers and four-wheelers. The clinic is easily accessible from Bannerghatta Road.",
      },
      {
        question: "Do you treat post-surgical patients?",
        answer: "Absolutely. We specialise in post-surgical rehabilitation for knee replacement, hip surgeries, spinal procedures, and more.",
      },
    ]);
  }

  // 6. Blogs Seeding
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.create([
      {
        title: "5 Exercises to Relieve Chronic Back Pain at Home",
        content: "Chronic back pain affects millions. Simple exercises like cat-cow stretches, pelvic tilts, and bird-dog movements can significantly reduce pain when done consistently. Always consult your physiotherapist before starting any exercise program to ensure safety.",
        category: "Back & Spine",
        tags: ["Back Pain", "Home Exercises", "Spine Health"],
      },
      {
        title: "Understanding Neurological Physiotherapy",
        content: "Neurological physiotherapy focuses on helping patients with conditions like stroke, Parkinson's disease, and multiple sclerosis regain movement and independence. Early intervention combined with specialised exercises can dramatically improve outcomes and quality of life.",
        category: "Neurological Rehab",
        tags: ["Neuro Rehab", "Stroke Recovery", "Parkinson's"],
      },
      {
        title: "Sports Injury Prevention Tips for Active Adults",
        content: "Warm up properly, strengthen supporting muscles, and listen to your body. Common sports injuries like ACL tears, hamstring strains, and ankle sprains are largely preventable with the right conditioning program designed by a qualified physiotherapist.",
        category: "Sports Injury",
        tags: ["Sports", "Injury Prevention", "Fitness"],
      },
    ]);
  }

  // 7. Gallery Seeding
  const galleryCount = await Gallery.countDocuments({ category: "gallery" });
  if (galleryCount === 0) {
    await Gallery.create([
      {
        imageUrl: "https://ik.imagekit.io/sugamclinic/waiting-area.jpg",
        category: "gallery",
        caption: "Modern Clinic Reception",
        order: 1,
      },
      {
        imageUrl: "https://ik.imagekit.io/sugamclinic/consulting-room.jpg",
        category: "gallery",
        caption: "Physiotherapy Treatment Room",
        order: 2,
      },
      {
        imageUrl: "https://ik.imagekit.io/sugamclinic/diagnostic-tools.jpg",
        category: "gallery",
        caption: "Advanced Rehabilitation Equipment",
        order: 3,
      },
    ]);
  }
}
