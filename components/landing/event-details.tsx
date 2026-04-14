'use client';

export default function EventDetails() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section title */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Event Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your running distance and join the celebration of strength and pride
            </p>
          </div>

          {/* Race categories grid */}
          <div className="space-y-8">
            {/* 10km */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border p-8 md:p-12">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-block">
                      <span className="text-sm font-bold text-primary bg-primary/10 rounded-full px-4 py-2">
                        20% TRAIL, 80% ROAD
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground">10km</h3>
                    <div className="space-y-2 text-foreground/80">
                      <p className="font-medium">Regular: 1,100₱ | Early Bird: 1,000₱</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Quality Medal
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Singlet
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Race Bib
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Post Race Snacks
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Finisher Shirt - ₱350 (Optional)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            </div>

            {/* 5km */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-border p-8 md:p-12">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-block">
                      <span className="text-sm font-bold text-secondary bg-secondary/10 rounded-full px-4 py-2">
                        20% TRAIL, 80% ROAD
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground">5km</h3>
                    <div className="space-y-2 text-foreground/80">
                      <p className="font-medium">Regular: 900₱ | Early Bird: 800₱</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Quality Medal
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Singlet
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Race Bib
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Post Race Snacks
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>

            {/* 3km */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-border p-8 md:p-12">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-block">
                      <span className="text-sm font-bold text-accent bg-accent/10 rounded-full px-4 py-2">
                        30% TRAIL, 70% ROAD
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground">3km</h3>
                    <div className="space-y-2 text-foreground/80">
                      <p className="font-medium">Regular: 800₱ | Early Bird: 700₱</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Quality Medal
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Singlet
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Race Bib
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Registration note */}
          <div className="mt-12 p-8 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-center text-foreground/80">
              <span className="font-semibold">Early Bird Registration:</span> April 15 - May 10 |{' '}
              <span className="font-semibold">Regular Registration:</span> May 11 - May 31
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
