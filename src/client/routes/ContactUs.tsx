import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@server/supabase";

export function ContactUsPage() {
	const navigate = useNavigate();

	const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1);
  	};
	
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [issueName, setIssueName] = useState("");
	const [issueDescription, setIssueDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
  	const [errorMsg, setErrorMsg] = useState<string | null>(null);

  	const handleSubmit = async () => {
    	setErrorMsg(null);
    	setSuccessMsg(null);

		if (!name.trim()) return setErrorMsg("Please enter your name.");
    	if (!email.trim()) return setErrorMsg("Please enter your email.");
   		if (!issueName.trim()) return setErrorMsg("Please enter a name for the issue.");
    	if (!issueDescription.trim()) return setErrorMsg("Please describe the issue.");

    	setLoading(true);
    	try {
      		const { error } = await supabase.from("contact_submissions").insert({
        		name: name.trim(),
        		email: email.trim(),
        		issue_name: issueName.trim(),
        		issue_description: issueDescription.trim(),
      		});
      		if (error) throw error;
      		setSuccessMsg("Your report has been submitted. Thank you!");
      		setName("");
			setEmail("");
			setIssueName("");
      		setIssueDescription("");
    	} catch (err: any) {
      		setErrorMsg(err.message || "Something went wrong. Please try again.");
    	} finally {
      		setLoading(false);
    	}
  	};

	return (
		<div className="min-h-screen bg-customBeige text-black">

			{/* Title + divider */}
			<div className="py-6 text-center">
				<h1 className="text-4xl font-medium tracking-wide">
					Contact Us
				</h1>
			</div>
			<hr className="border-black" />
			<div className="px-6 py-4">
				<button
					onClick={handleBack}
					className="bg-customGreen px-4 py-2 rounded top-6 left-6 flex items-center gap-1 text-sm font-medium text-black hover:opacity-60 transition-opacity cursor-pointer"
				>
        			← Back
      			</button>
			</div>
			{/* Page content */}
      		<div className="mx-auto max-w-3xl space-y-6 px-6 pb-10">
        		{/* Info box */}
        		<div className="rounded bg-gray-300 p-6 text-base leading-relaxed">
          			<p>Have questions about the website?</p>
					<p className="mt-3">
						Contact us by email at{" "}
						<a href="mailto:localloopLLC@gmail.com" className="underline hover:opacity-75">
							winghacks2026violet@gmail.com
						</a>
					</p>
          			
        		</div>

        		{/* Report form box */}
        		<div className="rounded bg-gray-300 p-6">
          			<p className="mb-4 text-base">
            			Need to report something? Fill out this form.
          			</p>

					<div className="flex gap-6 mb-4 w-full">
					<div className="flex flex-col flex-1">
						<label className="mb-1 block text-sm font-medium">Name:</label>
						<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded border border-gray-400 bg-customBeige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
						/>
					</div>

					<div className="flex flex-col flex-1">
						<label className="mb-1 block text-sm font-medium">Email:</label>
						<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded border border-gray-400 bg-customBeige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
						/>
					</div>
					</div>

					<label className="mb-1 block text-sm font-medium">Name of issue:</label>
					<input
					type="text"
					value={issueName}
					onChange={(e) => setIssueName(e.target.value)}
					className="mb-4 block w-full rounded border border-gray-400 bg-customBeige px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
					/>

        			<label className="mb-1 block text-sm font-medium">
            			Description of issue:
          			</label>
          			<textarea
            			value={issueDescription}
            			onChange={(e) => setIssueDescription(e.target.value)}
            			rows={8}
            			className="mb-6 block w-full rounded border border-gray-400 bg-customBeige px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          			/>

					{errorMsg && (
            			<p className="mb-4 text-sm text-red-600">{errorMsg}</p>
          			)}

          			{successMsg && (
            			<p className="mb-4 text-sm text-green-700">{successMsg}</p>
          			)}

          			<div className="flex justify-end">
            			<button
              				onClick={handleSubmit}
              				disabled={loading}
              				className={`rounded-full bg-customGreen px-6 py-2 text-sm font-medium transition-opacity ${
                				loading ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
              				}`}
						>              
							{loading ? "Submitting..." : "Submit Form"}
            			</button>
          			</div>
          		</div>
        	</div>
      </div>
  );
}