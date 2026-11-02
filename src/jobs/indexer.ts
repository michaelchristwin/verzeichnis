const ARWEAVE_GATEWAY = "https://arweave.net/graphql";

export default {
  async scheduled(controller: Bun.CronController) {
    console.log(controller.cron);
    console.log(controller.type);
    console.log(controller.scheduledTime);
    const query = `
  query {
	transactions(
        first: 100
		sort: HEIGHT_DESC
		tags: [
            { name: "Contract-Use", values: ["M3tering Protocol"] }
            { name: "Content-Type",  values: ["application/json"] }
            { name: "Contract-Label", values: ["M3ters"]}
              ]
	            )
        {
		pageInfo { hasNextPage }
		edges {
			cursor
			node {
				id
				owner { address }
				tags { name value }
        block { height timestamp }
			}
		}
	}
}
  `;
    const response = await fetch(ARWEAVE_GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const path = "../output.json";
    // @ts-expect-error
    await Bun.write(path, JSON.stringify(result.data.transactions));
    // @ts-ignore
    console.log(JSON.stringify(result.data.transactions));
    // @ts-ignore
    return result.data.transactions;
  },
};
