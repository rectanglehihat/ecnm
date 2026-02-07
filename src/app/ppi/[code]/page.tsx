interface PageProps {
	params: Promise<{ code: string }>;
	searchParams: Promise<{ code?: string; name?: string }>;
}

export default async function name({ params, searchParams }: PageProps) {
	const { code } = await params;
	console.log('ppi code', code);

	return <div>ppi dynamic page</div>;
}
