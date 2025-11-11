import { DynamicTable, Link } from "@forge/react";

import type { Repository } from "../../common/types";

type RepositoriesProps = {
  repositories: Repository[];
};

const Repositories = ({ repositories } : RepositoriesProps) => {

	const head = {
		cells: [
			{ key: "name", content: "Name", isSortable: true },
      { key: "project", content: "Project", isSortable: true },
      { key: "link", content: "Link" },
		]
	};
	const rows = repositories.map((repository) => {
		const { name, description, url } = repository;

		return {
			 cells: [
					{content: name },
					{content: description },
					{content: 
						<Link href={url} openNewTab>
							Open
						</Link> 
					}
				]
		}
	})

  return (
		<DynamicTable head={head} isFixedSize rows={rows} />
	);
}

export default Repositories;