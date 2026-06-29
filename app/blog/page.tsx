import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const posts = [
    {
      title: "Top 5 Benefits of Regular Dental Checkups",
      slug: "top-5-benefits-regular-dental-checkups",
      excerpt: "Discover why visiting your dentist every six months is crucial for your overall health, not just your teeth.",
      author: "Dr. Sarah Johnson",
      date: "Oct 15, 2026",
      readTime: "5 min read",
      category: "Dental Health",
      imageUrl: "https://ui-avatars.com/api/?name=Dental&background=EEF0FF&color=2200CC&size=800"
    },
    {
      title: "Understanding Heart Health in the UAE",
      slug: "understanding-heart-health-uae",
      excerpt: "Heart disease is a leading concern in the region. Learn about the risk factors and how to maintain a healthy heart.",
      author: "Dr. Ahmed Al Mansouri",
      date: "Oct 10, 2026",
      readTime: "8 min read",
      category: "Cardiology",
      imageUrl: "https://ui-avatars.com/api/?name=Heart&background=F5F6FA&color=0A0A2E&size=800"
    },
    {
      title: "Skincare Secrets for the Middle East Climate",
      slug: "skincare-secrets-middle-east-climate",
      excerpt: "The hot and arid climate of the GCC can take a toll on your skin. Here are expert tips from top dermatologists.",
      author: "Dr. Fatima Ali",
      date: "Oct 5, 2026",
      readTime: "6 min read",
      category: "Dermatology",
      imageUrl: "https://ui-avatars.com/api/?name=Skin&background=ECFDF5&color=059669&size=800"
    }
  ];

  const categories = ["All", "Dental Health", "Cardiology", "Dermatology", "Pediatrics", "Nutrition"];

  return (
    <div className="bg-gray-bg min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">Docmate Health Blog</h1>
          <p className="text-lg text-text-mid leading-relaxed">
            Expert medical advice, health tips, and the latest news from top healthcare professionals across the GCC.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 w-full max-w-4xl">
          {categories.map((cat, i) => (
            <button key={cat} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              i === 0 
                ? "bg-blue-primary text-white shadow-md shadow-blue-primary/20" 
                : "bg-white border border-gray-border text-text-mid hover:border-blue-primary hover:text-blue-primary"
            }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post (First post) */}
        <div className="w-full bg-white border border-gray-border rounded-3xl overflow-hidden shadow-sm mb-12 flex flex-col md:flex-row group cursor-pointer hover:border-blue-primary/50 transition-colors">
          <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-200">
            <Image src={posts[0].imageUrl} alt={posts[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-light text-blue-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{posts[0].category}</span>
              <span className="text-sm font-medium text-text-light flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {posts[0].date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4 leading-tight group-hover:text-blue-primary transition-colors">
              <Link href={`/blog/${posts[0].slug}`}>{posts[0].title}</Link>
            </h2>
            <p className="text-text-mid text-lg mb-8 line-clamp-3 leading-relaxed">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-dark">
                <User className="w-4 h-4 text-text-light" /> {posts[0].author}
              </div>
              <span className="text-sm font-bold text-blue-primary flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
            </div>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {posts.slice(1).map((post) => (
            <div key={post.slug} className="bg-white border border-gray-border rounded-2xl overflow-hidden shadow-sm flex flex-col group cursor-pointer hover:border-blue-primary/50 transition-colors">
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-light text-blue-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{post.category}</span>
                  <span className="text-xs font-medium text-text-light">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-text-dark mb-3 leading-snug group-hover:text-blue-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-text-mid text-sm mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-border">
                  <div className="text-xs font-semibold text-text-dark flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-text-light" /> {post.author}
                  </div>
                  <span className="text-xs font-medium text-text-light">{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <Button variant="outline" className="border-2 border-blue-primary text-blue-primary hover:bg-blue-light h-12 px-8 rounded-xl font-semibold">
            Load More Articles
          </Button>
        </div>

      </div>
    </div>
  );
}
