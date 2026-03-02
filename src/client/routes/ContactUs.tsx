export function ContactUsPage() {
	return (
		<div className="py-4 px-20 text-black">
			<div className="my-10 flex items-center justify-between">
				<h1 className="font-oswald text-5xl">Contact Us</h1>

				<button
					className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
					onClick={() => window.history.back()}
				>
					← Back
				</button>
			</div>

			<div className="mx-auto w-full max-w-4xl">
				<p className="mt-4 font-redhat text-base text-black/80">
					Questions, feedback, or support requests can be sent to
					winghacks2026violet@gmail.com.
				</p>
			</div>
		</div>
	);
}
