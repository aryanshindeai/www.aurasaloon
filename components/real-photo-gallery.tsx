'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, X, ExternalLink, Upload, ShieldCheck, Sparkles, Filter, Calendar, MessageSquare, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SALON_CONFIG } from '@/config/salon-config';
import { createQuickWhatsAppUrl, CALL_HREF, CALL_NUMBER } from '@/lib/whatsapp';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  sourceType: 'owner-verified' | 'google-places';
  authorName?: string;
  authorUri?: string;
  googleMapsUri?: string;
  description?: string;
  priority?: string;
}

interface RealPhotoGalleryProps {
  onOpenBooking?: () => void;
}

export default function RealPhotoGallery({ onOpenBooking }: RealPhotoGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isLiveGooglePlaces, setIsLiveGooglePlaces] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Salon Interior');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch photos from Places API and Owner Registry
  useEffect(() => {
    let isMounted = true;

    async function loadGalleryData() {
      try {
        // 1. Fetch Owner Verified Photos
        const ownerRes = await fetch('/api/owner-photos');
        let ownerItems: GalleryPhoto[] = [];
        if (ownerRes.ok) {
          const ownerJson = await ownerRes.json();
          if (ownerJson.photos) {
            ownerItems = ownerJson.photos.map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              imageUrl: p.imageUrl,
              sourceType: 'owner-verified' as const,
              authorName: p.attribution,
              description: p.description,
              priority: p.priority
            }));
          }
        }

        // 2. Fetch Google Places API (New) Photos
        const placesRes = await fetch('/api/places/details');
        let placesItems: GalleryPhoto[] = [];
        if (placesRes.ok) {
          const placesJson = await placesRes.json();
          if (placesJson.place?.hasLiveGooglePlaces && placesJson.place?.photos?.length) {
            if (isMounted) setIsLiveGooglePlaces(true);
            placesItems = placesJson.place.photos.map((ph: any, idx: number) => ({
              id: `gphoto-${idx}`,
              title: `Aura Salon Perspective ${idx + 1}`,
              category: 'Google Listing Photo',
              imageUrl: ph.proxyUrl,
              sourceType: 'google-places' as const,
              authorName: ph.authorAttributions?.[0]?.displayName || 'Google Maps Contributor',
              authorUri: ph.authorAttributions?.[0]?.uri,
              googleMapsUri: placesJson.place.googleMapsUri,
              description: 'Retrieved from verified Aura The Salon Google Business Profile in Chandrapur.',
              priority: '09'
            }));
          }
        }

        // Merge: Owner verified photos first, followed by Places photos
        const combined = [...ownerItems, ...placesItems];
        if (isMounted) {
          setPhotos(combined);
        }
      } catch (err) {
        console.error('Failed to load gallery assets:', err);
      }
    }

    loadGalleryData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOwnerUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadUrl) return;

    try {
      const res = await fetch('/api/owner-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          imageUrl: uploadUrl,
          description: uploadDesc,
          author: uploadAuthor || 'Aura Salon Owner Upload'
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.photo) {
          setPhotos((prev) => [
            {
              id: json.photo.id,
              title: json.photo.title,
              category: json.photo.category,
              imageUrl: json.photo.imageUrl,
              sourceType: 'owner-verified',
              authorName: json.photo.attribution,
              description: json.photo.description,
              priority: json.photo.priority
            },
            ...prev
          ]);
        }
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadTitle('');
          setUploadUrl('');
          setUploadDesc('');
          setUploadAuthor('');
          setUploadSuccess(false);
          setShowUploadModal(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const categories = ['All', 'Salon Interior', 'Hair Services', 'Bridal Couture', 'Client Experience'];

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#E9E0D5] text-[#302C29] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E0D5]/70 border border-[#887D73]/20 text-[#302C29] text-[11px] uppercase tracking-[0.25em] font-mono">
              <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Real Photography</span>
            </div>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl text-[#302C29] font-light leading-tight">
              Genuine Photographs of <span className="italic font-normal text-[#887D73]">Aura The Salon.</span>
            </h2>

            <p className="text-base text-[#887D73] font-light leading-relaxed">
              Authentic photography of our styling workstations, salon interior, and genuine client care at Beside SBI, Civil Lines, Chandrapur.
            </p>
          </div>

          {/* Attribution & Owner Upload Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isLiveGooglePlaces && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] text-[10px] uppercase font-mono tracking-wider text-[#887D73] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Places Verified</span>
              </span>
            )}

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-full bg-[#F8F5F0] border border-[#E9E0D5] hover:border-[#887D73] text-xs font-mono uppercase tracking-wider text-[#302C29] flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Owner Photo Upload</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-mono whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-[#302C29] text-[#F8F5F0] font-medium shadow-xs'
                  : 'bg-[#F8F5F0] border border-[#E9E0D5] text-[#887D73] hover:text-[#302C29]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedPhoto(photo)}
              className="relative h-80 rounded-3xl overflow-hidden card-ivory cursor-pointer group shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover object-center filter brightness-[0.98] group-hover:scale-104 transition-transform duration-600"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#302C29]/80 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              {/* Badges & Information */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-[#F8F5F0]">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 text-[#302C29] text-[9px] font-mono uppercase tracking-wider backdrop-blur-md">
                    {photo.category}
                  </span>

                  <div className="p-2 rounded-full bg-[#302C29]/80 text-[#F8F5F0] group-hover:bg-[#C5A059] group-hover:text-[#302C29] transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-xl font-light text-white">
                    {photo.title}
                  </h3>
                  <p className="text-[10px] text-stone-300 font-mono line-clamp-1">
                    Photo: {photo.authorName || 'Aura Salon'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal with Strict Attribution */}
        <AnimatePresence>
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-[#302C29]/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#FFFFFF]/90 text-[#302C29] hover:bg-[#FFFFFF] shadow-md border border-[#E9E0D5]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="h-[55vh] sm:h-[65vh] bg-[#F8F5F0] flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Attribution & Metadata Bar */}
                <div className="p-6 bg-[#FFFFFF] border-t border-[#E9E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#887D73] font-mono">
                        {selectedPhoto.category}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-mono">
                        {selectedPhoto.sourceType === 'google-places' ? 'Google Places Profile Photo' : 'Owner Verified Salon Photo'}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light">
                      {selectedPhoto.title}
                    </h3>

                    {selectedPhoto.description && (
                      <p className="text-xs text-[#887D73] font-light">
                        {selectedPhoto.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end text-xs font-mono text-[#887D73] space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={createQuickWhatsAppUrl('Salon Service', `Inquiring about style/facility from photo: ${selectedPhoto.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Book on WhatsApp</span>
                      </a>

                      {onOpenBooking && (
                        <button
                          onClick={() => {
                            const pTitle = selectedPhoto.title;
                            setSelectedPhoto(null);
                            onOpenBooking();
                          }}
                          className="px-4 py-2 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Request Slot</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end text-[11px] text-[#887D73] space-y-0.5">
                      <span>
                        Attribution: <strong className="text-[#302C29]">{selectedPhoto.authorName}</strong>
                      </span>

                      {selectedPhoto.authorUri && (
                        <a
                          href={selectedPhoto.authorUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C5A059] hover:underline flex items-center gap-1"
                        >
                          <span>View Contributor Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {selectedPhoto.googleMapsUri && (
                        <a
                          href={selectedPhoto.googleMapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#887D73] hover:text-[#302C29] flex items-center gap-1"
                        >
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Gallery Booking Action Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#F8F5F0] border border-[#E9E0D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif-luxury text-2xl text-[#302C29] font-light">
              Experience the Craft in Person.
            </h3>
            <p className="text-xs text-[#887D73] font-light">
              Visit Aura The Salon Beside SBI, Civil Lines, Chandrapur or connect directly with reception.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-full bg-[#302C29] hover:bg-[#433E3A] text-[#F8F5F0] font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>BOOK APPOINTMENT</span>
              </button>
            )}

            <a
              href={createQuickWhatsAppUrl('General Consultation', 'Inquiring after browsing the photo gallery')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>

            <a
              href={CALL_HREF}
              className="p-3 rounded-full bg-[#FFFFFF] border border-[#E9E0D5] hover:border-[#887D73] text-[#302C29] flex items-center justify-center transition-colors shadow-xs"
              title="Call Aura The Salon"
              aria-label="Call Aura The Salon"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
            </a>
          </div>
        </div>

        {/* Owner Photograph Submission Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-[#302C29]/75 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-lg w-full bg-[#FFFFFF] border border-[#E9E0D5] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl"
              >
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-full text-[#887D73] hover:text-[#302C29] bg-[#F8F5F0] border border-[#E9E0D5]"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono block">
                    Owner Photo Management
                  </span>
                  <h3 className="font-serif-luxury text-3xl text-[#302C29] font-light mt-0.5">
                    Register Verified Photograph.
                  </h3>
                  <p className="text-xs text-[#887D73] font-light mt-1">
                    Add high-resolution, owner-approved original salon photographs for permanent display.
                  </p>
                </div>

                <form onSubmit={handleOwnerUploadSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono block">
                      Photograph Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aura Styling Atelier & Mirrors"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#302C29] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono block">
                        Category
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-3 py-2.5 text-xs text-[#302C29] focus:outline-none"
                      >
                        <option value="Salon Exterior">01. Salon Exterior</option>
                        <option value="Salon Entrance">02. Salon Entrance</option>
                        <option value="Salon Reception">03. Salon Reception</option>
                        <option value="Salon Interior">04. Salon Interior</option>
                        <option value="Workstations">05. Workstations</option>
                        <option value="Equipment">06. Real Equipment</option>
                        <option value="Hair Services">07. Hair Services</option>
                        <option value="Bridal Couture">08. Bridal Couture</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono block">
                        Author / Photographer
                      </label>
                      <input
                        type="text"
                        placeholder="Aura Salon Team"
                        value={uploadAuthor}
                        onChange={(e) => setUploadAuthor(e.target.value)}
                        className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#302C29] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono block">
                      Image URL or Local Asset Path *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/... or https://..."
                      value={uploadUrl}
                      onChange={(e) => setUploadUrl(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-[#302C29] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#302C29] font-mono block">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note about the area or service shown..."
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      className="w-full bg-[#F8F5F0] border border-[#E9E0D5] focus:border-[#C5A059] rounded-xl px-4 py-2 text-xs text-[#302C29] focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#302C29] text-[#F8F5F0] font-semibold text-xs uppercase tracking-widest hover:bg-[#433E3A] transition-all flex items-center justify-center gap-2"
                  >
                    {uploadSuccess ? 'Photo Registered Successfully!' : 'Register Verified Photo'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
