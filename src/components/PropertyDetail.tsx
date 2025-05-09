import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BedDouble, Bath, Square, MapPin, ArrowLeft, Share2, Heart, ExternalLink, Phone, MessageSquare, Link as LinkIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseFollower from "@/components/MouseFollower";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Panorama360Viewer from "@/components/Panorama360Viewer";
import { Property } from "@/types/property.types";

const PropertyDetail = ({ property }: { property: Property }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPanorama, setShowPanorama] = useState(false);
  console.log(property)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title} at ${property.location} for ${property.price}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard");
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleContact = () => {
    window.open("https://wa.me/1234567890?text=I'm interested in " + property.title);
  };

  const propertyImages = property.images?.length 
    ? property.images 
    : (property.image ? [property.image] : ['/placeholder.svg']);

  // Check if video is a valid URL
  const isValidUrl = (url?: string) => {
    try {
      return url ? new URL(url) : false;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <MouseFollower />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm mb-4 md:mb-6 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-md transition-colors"
            aria-label="Back to properties"
          >
            <ArrowLeft className="mr-1.5 w-4 h-4" />
            <span className="whitespace-nowrap">Back to Properties</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative">
              {showPanorama && property.panorama ? (
                <div className="h-[400px] md:h-[500px] relative rounded-lg overflow-hidden">
                  <Panorama360Viewer panoramaUrl={property.panorama} />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border-white/10 text-white"
                    onClick={() => setShowPanorama(false)}
                  >
                    Exit 360° View
                  </Button>
                </div>
              ) : (
                <>
                  {propertyImages.length > 1 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {propertyImages.map((image, index) => (
                          <CarouselItem key={index} className="h-[400px] md:h-[500px]">
                            <div className="h-full w-full relative rounded-lg overflow-hidden">
                              <img 
                                src={image} 
                                alt={`${property.title} - Image ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  ) : (
                    <div className="h-[400px] md:h-[500px] relative overflow-hidden rounded-lg">
                      <img 
                        src={propertyImages[0]} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {property.panorama && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border-white/10 text-white"
                      onClick={() => setShowPanorama(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><circle cx="12" cy="12" r="10"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"></path><path d="M7.8 7.8c-2.3 2.3-2.3 6.1 0 8.4"></path></svg>
                      View 360°
                    </Button>
                  )}
                </>
              )}
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-md border-white/10 text-white rounded-full w-10 h-10 p-0"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`bg-black/50 hover:bg-black/70 backdrop-blur-md border-white/10 text-white rounded-full w-10 h-10 p-0 ${isFavorite ? 'text-red-500' : ''}`}
                  onClick={handleFavorite}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium">
                {property.type}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-morphism p-6 rounded-lg h-full flex flex-col">
                <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
                
                {property.subtitle && (
                  <p className="text-muted-foreground mb-4">{property.subtitle}</p>
                )}
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                
                <div className="text-2xl font-bold mb-6">{property.price}</div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <BedDouble className="w-5 h-5 mb-1" />
                    <span className="text-sm">{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <Bath className="w-5 h-5 mb-1" />
                    <span className="text-sm">{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <Square className="w-5 h-5 mb-1" />
                    <span className="text-sm">{property.area || 0} sqft</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {property.power_supply && (
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-white/10 rounded-full">
                        <Video className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Power Supply</h4>
                        <p className="text-muted-foreground text-sm">{property.power_supply}</p>
                      </div>
                    </div>
                  )}
                  
                  {property.style && (
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-white/10 rounded-full">
                        <LinkIcon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Style</h4>
                        <p className="text-muted-foreground text-sm">{property.style}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto space-y-3">
                  <Button className="w-full" onClick={handleContact}>
                    <Phone className="mr-2 h-4 w-4" /> WhatsApp Contact
                  </Button>
                  <a href="mailto:info@grayscale.com">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" /> Email Inquiry
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sections with extra details */}
          {/* Sections with extra details */}
<div className="mt-8 grid grid-cols-1 gap-6">
  {/* Description */}
  {property.description && (
    <div className="glass-morphism p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Property Description</h2>
      <p className="text-muted-foreground whitespace-pre-line">
        {property.description}
      </p>
    </div>
  )}
  
  
  {/* Video Section - now full width like map section */}
  {isValidUrl(property.video_url) && (
    <div className="glass-morphism p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Property Video</h2>
      <div className="aspect-video bg-white/5 rounded-lg overflow-hidden">
        <iframe 
          src={property.video_url} 
          title="Property Video" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  )}
</div>

{/* Location Section */}
<div className="mt-8 glass-morphism p-6 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Location</h2>
  <div className="h-[300px] rounded-lg overflow-hidden">
    {property.maps_embed ? (
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{
          __html: property.maps_embed.replace(
            '<iframe',
            '<iframe style="width:100%; height:100%; min-height:300px; border:0;"'
          ),
        }}
      />
    ) : (
      <div className="w-full h-full bg-white/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-3">Map not available</p>
          <a 
            href={`https://www.google.com/maps/search/${encodeURIComponent(property.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium hover:underline"
          >
            View on Google Maps <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </div>
      </div>
    )}
  </div>
</div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;