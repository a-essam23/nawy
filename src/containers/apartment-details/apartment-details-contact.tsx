"use client";
import { Button } from "@mantine/core";
import useInfoStore from "@stores/info-store";
import { IconBrandWhatsapp } from "@tabler/icons-react";

interface ContactSidebarProps {
  name: string;
  slug: string;
}

const ApartmentDetailsContact: React.FC<ContactSidebarProps> = ({
  name,
  slug,
}) => {
  const { phone, email } = useInfoStore();
  const url = `${process.env.NEXT_PUBLIC_URL}/apartments/${slug}`;
  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">Contact Information</h3>
      <div className="space-y-3 text-gray-700">
        <p>Email: {email}</p>
        <p>Phone: {phone}</p>
      </div>
      <Button
        component="a"
        href={`https://wa.me/${phone}?text=${encodeURI(
          `I'm interested in ${name}.\n${url}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        leftSection={<IconBrandWhatsapp size={18} />}
        variant="filled"
        color="green"
        fullWidth
        mt="md"
      >
        Contact via WhatsApp
      </Button>
    </div>
  );
};
export default ApartmentDetailsContact;
