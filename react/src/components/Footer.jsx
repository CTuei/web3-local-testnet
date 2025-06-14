import logo from "../assets/logo-white.png";

const Footer = () => (
	<footer className="bg-gray-900 text-white py-12">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<div className="flex items-center mb-4">
						<img src={logo} alt="TokoCorp Logo" className="h-10 w-auto" />
					</div>
					<p className="text-gray-400">Leading the future of digital commerce with blockchain technology.</p>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-4">Company</h3>
					<ul className="space-y-2">
						{["About Us", "Careers", "Press"].map((item) => (
							<li key={item}>
								<a href={`#${item.toLowerCase().replace(" ", "")}`} className="text-gray-400 hover:text-white transition">
									{item}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-4">Support</h3>
					<ul className="space-y-2">
						{["Help Center", "Contact Us", "Terms of Service"].map((item) => (
							<li key={item}>
								<a href={`#${item.toLowerCase().replace(" ", "")}`} className="text-gray-400 hover:text-white transition">
									{item}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-4">Connect</h3>
					<ul className="space-y-2">
						{["Twitter", "LinkedIn", "Discord"].map((item) => (
							<li key={item}>
								<a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition">
									{item}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="mt-8 border-t border-gray-700 pt-6 text-center">
				<p className="text-gray-400">© 2025 TokoCorp. All rights reserved.</p>
			</div>
		</div>
	</footer>
);

export default Footer;