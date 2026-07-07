"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { createReview } from "@/app/actions/reviews";
import { Button } from "./ui/button";

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface DoctorReviewsProps {
  doctorId: string;
  doctorSlug: string;
  initialReviews: Review[];
}

export default function DoctorReviews({ doctorId, doctorSlug, initialReviews }: DoctorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [patientName, setPatientName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await createReview({
      doctorId,
      doctorSlug,
      patientName,
      rating,
      comment,
    });

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Thank you! Your review has been submitted successfully.");
      // Optimistically append the review
      const newReview: Review = {
        id: Math.random().toString(),
        patientName: patientName.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date(),
      };
      setReviews([newReview, ...reviews]);
      setPatientName("");
      setComment("");
      setRating(5);
    } else {
      setErrorMsg(res.error || "An error occurred");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Review Submission Form */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-text-dark mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-primary" />
          Write a Review
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-badge-bg text-green-badge p-3 rounded-lg text-sm border border-green-badge/20 font-medium">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-dark">Your Name</label>
              <input
                required
                type="text"
                placeholder="e.g. John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="bg-gray-bg border border-gray-border rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:border-blue-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-dark">Rating</label>
              <div className="flex items-center gap-1.5 h-11">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating ?? rating)
                          ? "text-star-color fill-star-color"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-dark">Review Comments</label>
            <textarea
              required
              rows={4}
              placeholder="Share your experience with the doctor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-bg border border-gray-border rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-blue-primary resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-primary hover:bg-blue-hover text-white rounded-xl h-11 px-6 font-bold text-sm shadow-md shadow-blue-primary/10"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-gray-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-text-dark mb-6">
          Patient Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p className="text-text-mid text-sm py-4">No reviews yet. Be the first to write a review!</p>
        ) : (
          <div className="flex flex-col gap-6 divide-y divide-gray-border">
            {reviews.map((rev, index) => (
              <div key={rev.id} className={`flex flex-col gap-3 ${index > 0 ? "pt-6" : ""}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-dark text-sm">{rev.patientName}</span>
                    <span className="text-[10px] text-text-light font-medium">{formatDate(rev.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? "text-star-color fill-star-color" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-text-mid text-sm leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
