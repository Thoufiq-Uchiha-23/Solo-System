"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface User {
  name: string | null;
  image: string | null;
  banner: string | null;
  socialLinks: Array<{ platform: string; url: string }> | null;
}

interface ProfileEditClientProps {
  user: User;
  updateProfileAction: (formData: FormData) => Promise<void>;
}

export function ProfileEditClient({
  user,
  updateProfileAction,
}: ProfileEditClientProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [banner, setBanner] = useState(user.banner || "");
  const [socialLinks, setSocialLinks] = useState<
    Array<{ platform: string; url: string }>
  >(user.socialLinks || []);

  const addSocialLink = () => {
    if (socialLinks.length < 10) {
      setSocialLinks([...socialLinks, { platform: "", url: "" }]);
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("banner", banner);
    formData.append("socialLinks", JSON.stringify(socialLinks));
    await updateProfileAction(formData);
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="h-auto text-white bg-[#020c1f] overflow-x-hidden">
      <div className="mx-auto px-6 pb-16 md:px-20 md:pb-8 pt-[70px] md:pt-[150px]">
        <div className="bg-[#010f2d] flex-col items-center justify-center rounded-xl p-6 w-full h-auto">
          {/* <div className="flex justify-between items-center pb-6"> */}
            <h2 className="text-5xl bg-gradient-to-r from-[#2355c1] to-[#042469] backdrop-blur-md bg-clip-text text-transparent font-vega font-semibold tracking-widest text-center">
              Edit Profile
            </h2>
          {/* </div> */}

          <form
            onSubmit={handleSubmit}
            className="text-left flex-col gap-4 flex-wrap"
          >
            <div className="flex-col md:flex items-start justify-between md:gap-4">
              {/* Name */}
              <div className="flex-col items-center justify-center w-full">
                <div className="px-2 py-2">
                  <label
                    htmlFor="name"
                    className="text-xl md:text-3xl font-vega text-[#2355c1]"
                  >
                    Name
                  </label>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full font-aeo bg-[#020c1f] border border-[#042469] rounded-3xl px-4 py-2 text-white placeholder-[#2355c1] focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>
              {/* Social Links */}
              <div className="flex-col items-center justify-between w-full">
                <div className="flex justify-between items-center mb-3">
                  <div className="px-2 py-2">
                    <label className="text-xl md:text-3xl font-vega text-[#2355c1]">
                      Social Links ({socialLinks.length}/10)
                    </label>
                  </div>

                  {socialLinks.length < 10 && (
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="text-xs font-aeo text-white bg-[#042469] hover:bg-[#2355c1] px-3 py-1 rounded-lg transition-colors"
                    >
                      + Add Link
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap md:flex-nowrap gap-2 bg-blue-700/5 rounded-lg p-2"
                    >
                      <input
                        type="text"
                        placeholder="e.g., Twitter, GitHub, LinkedIn"
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(index, "platform", e.target.value)
                        }
                        className="flex-1 font-aeo bg-[#020c1f] border border-[#042469] rounded-3xl px-3 py-2 text-white placeholder-[#2355c1] transition-colors focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-blue-500/20"
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                        className="flex font-aeo bg-[#020c1f] border border-[#042469] rounded-3xl px-3 py-2 text-white placeholder-[#2355c1] transition-colors focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4 md:gap-20">
              {/* Profile Image URL */}
              <div className="flex-col w-full">
                <div className="px-2 py-2">
                  <label
                    htmlFor="image"
                    className="text-xl md:text-3xl font-vega text-[#2355c1] p-2"
                  >
                    Profile Picture URL
                  </label>
                </div>

                <input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full font-aeo bg-[#020c1f] border border-[#042469] rounded-3xl px-4 py-2 text-white placeholder-[#2355c1] focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-[100px] h-[100px] rounded-lg mt-2 object-cover"
                  />
                )}
              </div>
              {/* Banner URL */}
              <div className="flex-col w-full">
                <div className="px-2 py-2">
                  <label
                    htmlFor="banner"
                    className="text-xl md:text-3xl font-vega text-[#2355c1] px-2 py-1"
                  >
                    Banner URL
                  </label>
                </div>

                <input
                  id="banner"
                  type="url"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full font-aeo bg-[#020c1f] border border-[#042469] rounded-3xl px-4 py-2 text-white placeholder-[#2355c1] focus:outline-none focus:border-[#2355c1] focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
                {banner && (
                  <img
                    src={banner}
                    alt="Banner Preview"
                    className="w-full h-[100px] rounded-lg mt-2 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/profile"
                className="flex-1 px-4 py-2 text-center text-sm md:text-lg font-aeo font-semibold border-[0.3px] border-slate-600 hover:border-slate-500 text-slate-300 rounded-3xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-2 text-sm md:text-lg font-aeo bg-gradient-to-r from-[#2355c1] to-[#042469] hover:from-[#376cdf] hover:to-[#0740b9] text-white font-semibold rounded-3xl transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}