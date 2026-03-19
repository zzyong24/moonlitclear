import { ProjectCard } from '~/app/(main)/projects/ProjectCard'

// 暂时使用静态项目列表，后续可以从 vault 读取
const projects = [
  {
    _id: 'thirdspace',
    name: 'ThirdSpace',
    url: 'https://github.com',
    description: '基于 Obsidian + MCP 的个人知识管理系统，文本是知识的通用接口。',
    icon: '',
  },
]

export async function Projects() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </ul>
  )
}
