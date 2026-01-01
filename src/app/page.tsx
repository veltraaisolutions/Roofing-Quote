import RoofingForm from "../../components/RoofingForm";

export default function Home() {
  return (
    <main className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-10 px-4 selection:bg-brand selection:text-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      {/* The Form Component */}
      <div className="relative z-10 w-full">
        <RoofingForm />
      </div>

      {/* Footer / Trust Bar */}
      <div className="mt-8 relative z-10 text-center">
        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          12 people requested a quote in the last 24 hours
        </p>
      </div>
    </main>
  );
}
