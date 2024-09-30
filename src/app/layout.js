import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import AddressProvider from "@/app/context/addressContext";
import CampaignProvider from "@/app/context/campaignContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CrowdCrypto",
  description: "Revolutionize Philanthropy: Trustless Crypto Donations for Global Impact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AddressProvider>
          <CampaignProvider>
            <Header />
            {children}
            <Footer />
          </CampaignProvider>
        </AddressProvider>
      </body>
    </html>
  );
}