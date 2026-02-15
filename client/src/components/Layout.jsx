export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white w-full">
      {/* Page Header */}
      {(title || subtitle) && (
        <div className="bg-gradient-to-r from-blue via-yellow to-red py-12 sm:py-16 w-full">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="section-title text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-gray-100">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={title || subtitle ? "max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" : "w-full"}>
        {children}
      </div>
    </div>
  );
}

