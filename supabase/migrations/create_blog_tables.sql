-- 文章分类表
CREATE TABLE post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE post_categories IS '{"chinese_title":"文章分类表","english_title":"Post Categories","chinese_description":"存储博客文章分类信息","english_description":"Stores blog post category information"}';
COMMENT ON COLUMN post_categories.id IS '{"chinese_title":"分类 ID","english_title":"Category ID","chinese_description":"分类唯一标识符","english_description":"Unique identifier for category"}';
COMMENT ON COLUMN post_categories.name IS '{"chinese_title":"分类名称","english_title":"Category Name","chinese_description":"分类中文名称","english_description":"Category name in Chinese"}';
COMMENT ON COLUMN post_categories.name_en IS '{"chinese_title":"英文名称","english_title":"English Name","chinese_description":"分类英文名称","english_description":"Category name in English"}';
COMMENT ON COLUMN post_categories.description IS '{"chinese_title":"分类描述","english_title":"Description","chinese_description":"分类详细描述","english_description":"Detailed category description"}';
COMMENT ON COLUMN post_categories.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"分类显示顺序","english_description":"Display order for category"}';
COMMENT ON COLUMN post_categories.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN post_categories.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN post_categories.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 文章标签表
CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE post_tags IS '{"chinese_title":"文章标签表","english_title":"Post Tags","chinese_description":"存储博客文章标签","english_description":"Stores blog post tags"}';
COMMENT ON COLUMN post_tags.id IS '{"chinese_title":"标签 ID","english_title":"Tag ID","chinese_description":"标签唯一标识符","english_description":"Unique identifier for tag"}';
COMMENT ON COLUMN post_tags.name IS '{"chinese_title":"标签名称","english_title":"Tag Name","chinese_description":"标签名称","english_description":"Tag name"}';
COMMENT ON COLUMN post_tags.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN post_tags.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN post_tags.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 文章表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  excerpt TEXT,
  excerpt_en TEXT,
  content TEXT NOT NULL,
  content_en TEXT,
  category_id UUID REFERENCES post_categories(id),
  cover_image TEXT,
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE posts IS '{"chinese_title":"文章表","english_title":"Posts","chinese_description":"存储博客文章数据","english_description":"Stores blog post data"}';
COMMENT ON COLUMN posts.id IS '{"chinese_title":"文章 ID","english_title":"Post ID","chinese_description":"文章唯一标识符","english_description":"Unique identifier for post"}';
COMMENT ON COLUMN posts.title IS '{"chinese_title":"文章标题","english_title":"Title","chinese_description":"文章中文标题","english_description":"Post title in Chinese"}';
COMMENT ON COLUMN posts.title_en IS '{"chinese_title":"英文标题","english_title":"English Title","chinese_description":"文章英文标题","english_description":"Post title in English"}';
COMMENT ON COLUMN posts.excerpt IS '{"chinese_title":"文章摘要","english_title":"Excerpt","chinese_description":"文章中文摘要","english_description":"Post excerpt in Chinese"}';
COMMENT ON COLUMN posts.excerpt_en IS '{"chinese_title":"英文摘要","english_title":"English Excerpt","chinese_description":"文章英文摘要","english_description":"Post excerpt in English"}';
COMMENT ON COLUMN posts.content IS '{"chinese_title":"文章内容","english_title":"Content","chinese_description":"文章中文内容","english_description":"Post content in Chinese"}';
COMMENT ON COLUMN posts.content_en IS '{"chinese_title":"英文内容","english_title":"English Content","chinese_description":"文章英文内容","english_description":"Post content in English"}';
COMMENT ON COLUMN posts.category_id IS '{"chinese_title":"分类 ID","english_title":"Category ID","chinese_description":"所属分类 ID","english_description":"Category ID"}';
COMMENT ON COLUMN posts.cover_image IS '{"chinese_title":"封面图片","english_title":"Cover Image","chinese_description":"文章封面图片 URL","english_description":"Cover image URL","format":"image"}';
COMMENT ON COLUMN posts.views IS '{"chinese_title":"阅读量","english_title":"Views","chinese_description":"文章阅读次数","english_description":"View count"}';
COMMENT ON COLUMN posts.is_published IS '{"chinese_title":"是否发布","english_title":"Is Published","chinese_description":"发布状态","english_description":"Publication status"}';
COMMENT ON COLUMN posts.published_at IS '{"chinese_title":"发布时间","english_title":"Published At","chinese_description":"发布时间","english_description":"Publication timestamp"}';
COMMENT ON COLUMN posts.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN posts.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN posts.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 文章 - 标签关联表
CREATE TABLE post_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES post_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(post_id, tag_id)
);

COMMENT ON TABLE post_tag_relations IS '{"chinese_title":"文章 - 标签关联表","english_title":"Post Tag Relations","chinese_description":"存储文章与标签的关联关系","english_description":"Stores relationships between posts and tags"}';
COMMENT ON COLUMN post_tag_relations.id IS '{"chinese_title":"关联 ID","english_title":"Relation ID","chinese_description":"关联唯一标识符","english_description":"Unique identifier for relation"}';
COMMENT ON COLUMN post_tag_relations.post_id IS '{"chinese_title":"文章 ID","english_title":"Post ID","chinese_description":"关联的文章 ID","english_description":"Related post ID"}';
COMMENT ON COLUMN post_tag_relations.tag_id IS '{"chinese_title":"标签 ID","english_title":"Tag ID","chinese_description":"关联的标签 ID","english_description":"Related tag ID"}';
COMMENT ON COLUMN post_tag_relations.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN post_tag_relations.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN post_tag_relations.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 教育经历表
CREATE TABLE educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL,
  school_name_en TEXT,
  major TEXT,
  major_en TEXT,
  degree TEXT,
  degree_en TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE educations IS '{"chinese_title":"教育经历表","english_title":"Educations","chinese_description":"存储个人教育经历","english_description":"Stores personal education history"}';
COMMENT ON COLUMN educations.id IS '{"chinese_title":"经历 ID","english_title":"Education ID","chinese_description":"教育经历唯一标识符","english_description":"Unique identifier for education"}';
COMMENT ON COLUMN educations.school_name IS '{"chinese_title":"学校名称","english_title":"School Name","chinese_description":"学校中文名称","english_description":"School name in Chinese"}';
COMMENT ON COLUMN educations.school_name_en IS '{"chinese_title":"英文校名","english_title":"English School Name","chinese_description":"学校英文名称","english_description":"School name in English"}';
COMMENT ON COLUMN educations.major IS '{"chinese_title":"专业","english_title":"Major","chinese_description":"专业中文名称","english_description":"Major in Chinese"}';
COMMENT ON COLUMN educations.major_en IS '{"chinese_title":"英文专业","english_title":"English Major","chinese_description":"专业英文名称","english_description":"Major in English"}';
COMMENT ON COLUMN educations.degree IS '{"chinese_title":"学位","english_title":"Degree","chinese_description":"学位中文名称","english_description":"Degree in Chinese"}';
COMMENT ON COLUMN educations.degree_en IS '{"chinese_title":"英文学位","english_title":"English Degree","chinese_description":"学位英文名称","english_description":"Degree in English"}';
COMMENT ON COLUMN educations.start_date IS '{"chinese_title":"开始日期","english_title":"Start Date","chinese_description":"入学日期","english_description":"Start date"}';
COMMENT ON COLUMN educations.end_date IS '{"chinese_title":"结束日期","english_title":"End Date","chinese_description":"毕业日期","english_description":"End date"}';
COMMENT ON COLUMN educations.description IS '{"chinese_title":"描述","english_title":"Description","chinese_description":"经历描述","english_description":"Education description"}';
COMMENT ON COLUMN educations.description_en IS '{"chinese_title":"英文描述","english_title":"English Description","chinese_description":"英文经历描述","english_description":"Education description in English"}';
COMMENT ON COLUMN educations.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"显示顺序","english_description":"Display order"}';
COMMENT ON COLUMN educations.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN educations.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN educations.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 工作/实习经历表
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_name_en TEXT,
  position TEXT,
  position_en TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  description_en TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE experiences IS '{"chinese_title":"工作/实习经历表","english_title":"Experiences","chinese_description":"存储工作和实习经历","english_description":"Stores work and internship experience"}';
COMMENT ON COLUMN experiences.id IS '{"chinese_title":"经历 ID","english_title":"Experience ID","chinese_description":"经历唯一标识符","english_description":"Unique identifier for experience"}';
COMMENT ON COLUMN experiences.company_name IS '{"chinese_title":"机构名称","english_title":"Company Name","chinese_description":"机构中文名称","english_description":"Company name in Chinese"}';
COMMENT ON COLUMN experiences.company_name_en IS '{"chinese_title":"英文机构名","english_title":"English Company Name","chinese_description":"机构英文名称","english_description":"Company name in English"}';
COMMENT ON COLUMN experiences.position IS '{"chinese_title":"职位","english_title":"Position","chinese_description":"职位中文名称","english_description":"Position in Chinese"}';
COMMENT ON COLUMN experiences.position_en IS '{"chinese_title":"英文职位","english_title":"English Position","chinese_description":"职位英文名称","english_description":"Position in English"}';
COMMENT ON COLUMN experiences.start_date IS '{"chinese_title":"开始日期","english_title":"Start Date","chinese_description":"入职日期","english_description":"Start date"}';
COMMENT ON COLUMN experiences.end_date IS '{"chinese_title":"结束日期","english_title":"End Date","chinese_description":"离职日期","english_description":"End date"}';
COMMENT ON COLUMN experiences.description IS '{"chinese_title":"描述","english_title":"Description","chinese_description":"经历描述","english_description":"Experience description"}';
COMMENT ON COLUMN experiences.description_en IS '{"chinese_title":"英文描述","english_title":"English Description","chinese_description":"英文经历描述","english_description":"Experience description in English"}';
COMMENT ON COLUMN experiences.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"显示顺序","english_description":"Display order"}';
COMMENT ON COLUMN experiences.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN experiences.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN experiences.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 项目表
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  cover_image TEXT,
  demo_url TEXT,
  code_url TEXT,
  start_date DATE,
  end_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE projects IS '{"chinese_title":"项目表","english_title":"Projects","chinese_description":"存储个人项目作品","english_description":"Stores personal project portfolio"}';
COMMENT ON COLUMN projects.id IS '{"chinese_title":"项目 ID","english_title":"Project ID","chinese_description":"项目唯一标识符","english_description":"Unique identifier for project"}';
COMMENT ON COLUMN projects.title IS '{"chinese_title":"项目名称","english_title":"Title","chinese_description":"项目中文名称","english_description":"Project title in Chinese"}';
COMMENT ON COLUMN projects.title_en IS '{"chinese_title":"英文项目名","english_title":"English Title","chinese_description":"项目英文名称","english_description":"Project title in English"}';
COMMENT ON COLUMN projects.description IS '{"chinese_title":"项目描述","english_title":"Description","chinese_description":"项目中文描述","english_description":"Project description in Chinese"}';
COMMENT ON COLUMN projects.description_en IS '{"chinese_title":"英文描述","english_title":"English Description","chinese_description":"项目英文描述","english_description":"Project description in English"}';
COMMENT ON COLUMN projects.cover_image IS '{"chinese_title":"封面图片","english_title":"Cover Image","chinese_description":"项目封面图片 URL","english_description":"Cover image URL","format":"image"}';
COMMENT ON COLUMN projects.demo_url IS '{"chinese_title":"演示链接","english_title":"Demo URL","chinese_description":"项目演示地址","english_description":"Project demo URL"}';
COMMENT ON COLUMN projects.code_url IS '{"chinese_title":"代码链接","english_title":"Code URL","chinese_description":"项目代码地址","english_description":"Project code URL"}';
COMMENT ON COLUMN projects.start_date IS '{"chinese_title":"开始日期","english_title":"Start Date","chinese_description":"项目开始日期","english_description":"Project start date"}';
COMMENT ON COLUMN projects.end_date IS '{"chinese_title":"结束日期","english_title":"End Date","chinese_description":"项目结束日期","english_description":"Project end date"}';
COMMENT ON COLUMN projects.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"显示顺序","english_description":"Display order"}';
COMMENT ON COLUMN projects.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN projects.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN projects.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 项目 - 标签关联表
CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES post_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(project_id, tag_id)
);

COMMENT ON TABLE project_tags IS '{"chinese_title":"项目标签表","english_title":"Project Tags","chinese_description":"存储项目与标签的关联关系","english_description":"Stores relationships between projects and tags"}';
COMMENT ON COLUMN project_tags.id IS '{"chinese_title":"关联 ID","english_title":"Relation ID","chinese_description":"关联唯一标识符","english_description":"Unique identifier for relation"}';
COMMENT ON COLUMN project_tags.project_id IS '{"chinese_title":"项目 ID","english_title":"Project ID","chinese_description":"关联的项目 ID","english_description":"Related project ID"}';
COMMENT ON COLUMN project_tags.tag_id IS '{"chinese_title":"标签 ID","english_title":"Tag ID","chinese_description":"关联的标签 ID","english_description":"Related tag ID"}';
COMMENT ON COLUMN project_tags.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN project_tags.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN project_tags.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 友情链接表
CREATE TABLE friend_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  logo TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE friend_links IS '{"chinese_title":"友情链接表","english_title":"Friend Links","chinese_description":"存储友情链接信息","english_description":"Stores friend link information"}';
COMMENT ON COLUMN friend_links.id IS '{"chinese_title":"友链 ID","english_title":"Link ID","chinese_description":"友链唯一标识符","english_description":"Unique identifier for link"}';
COMMENT ON COLUMN friend_links.name IS '{"chinese_title":"博客名称","english_title":"Blog Name","chinese_description":"博客名称","english_description":"Blog name"}';
COMMENT ON COLUMN friend_links.url IS '{"chinese_title":"链接地址","english_title":"URL","chinese_description":"博客链接地址","english_description":"Blog URL"}';
COMMENT ON COLUMN friend_links.description IS '{"chinese_title":"描述","english_title":"Description","chinese_description":"友链描述","english_description":"Link description"}';
COMMENT ON COLUMN friend_links.description_en IS '{"chinese_title":"英文描述","english_title":"English Description","chinese_description":"友链英文描述","english_description":"Link description in English"}';
COMMENT ON COLUMN friend_links.logo IS '{"chinese_title":"Logo 图片","english_title":"Logo","chinese_description":"博客 Logo 图片 URL","english_description":"Blog logo image URL","format":"image"}';
COMMENT ON COLUMN friend_links.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"显示顺序","english_description":"Display order"}';
COMMENT ON COLUMN friend_links.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN friend_links.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN friend_links.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 学术项目表
CREATE TABLE academic_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  paper_url TEXT,
  project_url TEXT,
  start_date DATE,
  end_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE academic_projects IS '{"chinese_title":"学术项目表","english_title":"Academic Projects","chinese_description":"存储学术研究项目","english_description":"Stores academic research projects"}';
COMMENT ON COLUMN academic_projects.id IS '{"chinese_title":"项目 ID","english_title":"Project ID","chinese_description":"学术项目唯一标识符","english_description":"Unique identifier for academic project"}';
COMMENT ON COLUMN academic_projects.title IS '{"chinese_title":"项目名称","english_title":"Title","chinese_description":"项目中文名称","english_description":"Project title in Chinese"}';
COMMENT ON COLUMN academic_projects.title_en IS '{"chinese_title":"英文项目名","english_title":"English Title","chinese_description":"项目英文名称","english_description":"Project title in English"}';
COMMENT ON COLUMN academic_projects.description IS '{"chinese_title":"项目描述","english_title":"Description","chinese_description":"项目中文描述","english_description":"Project description in Chinese"}';
COMMENT ON COLUMN academic_projects.description_en IS '{"chinese_title":"英文描述","english_title":"English Description","chinese_description":"项目英文描述","english_description":"Project description in English"}';
COMMENT ON COLUMN academic_projects.paper_url IS '{"chinese_title":"论文链接","english_title":"Paper URL","chinese_description":"相关论文地址","english_description":"Related paper URL"}';
COMMENT ON COLUMN academic_projects.project_url IS '{"chinese_title":"项目链接","english_title":"Project URL","chinese_description":"项目主页地址","english_description":"Project homepage URL"}';
COMMENT ON COLUMN academic_projects.start_date IS '{"chinese_title":"开始日期","english_title":"Start Date","chinese_description":"项目开始日期","english_description":"Project start date"}';
COMMENT ON COLUMN academic_projects.end_date IS '{"chinese_title":"结束日期","english_title":"End Date","chinese_description":"项目结束日期","english_description":"Project end date"}';
COMMENT ON COLUMN academic_projects.sort_order IS '{"chinese_title":"排序顺序","english_title":"Sort Order","chinese_description":"显示顺序","english_description":"Display order"}';
COMMENT ON COLUMN academic_projects.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN academic_projects.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN academic_projects.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 学术项目 - 标签关联表
CREATE TABLE academic_project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES academic_projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES post_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(project_id, tag_id)
);

COMMENT ON TABLE academic_project_tags IS '{"chinese_title":"学术项目标签表","english_title":"Academic Tags","chinese_description":"存储学术项目与标签的关联关系","english_description":"Stores relationships between academic projects and tags"}';
COMMENT ON COLUMN academic_project_tags.id IS '{"chinese_title":"关联 ID","english_title":"Relation ID","chinese_description":"关联唯一标识符","english_description":"Unique identifier for relation"}';
COMMENT ON COLUMN academic_project_tags.project_id IS '{"chinese_title":"项目 ID","english_title":"Project ID","chinese_description":"关联的学术项目 ID","english_description":"Related academic project ID"}';
COMMENT ON COLUMN academic_project_tags.tag_id IS '{"chinese_title":"标签 ID","english_title":"Tag ID","chinese_description":"关联的标签 ID","english_description":"Related tag ID"}';
COMMENT ON COLUMN academic_project_tags.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN academic_project_tags.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN academic_project_tags.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 博客统计数据表
CREATE TABLE blog_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  online_start_date DATE DEFAULT '2024-01-01',
  total_words INTEGER DEFAULT 0,
  manual_adjustment INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

COMMENT ON TABLE blog_statistics IS '{"chinese_title":"博客统计数据表","english_title":"Blog Statistics","chinese_description":"存储博客运营统计数据","english_description":"Stores blog operation statistics"}';
COMMENT ON COLUMN blog_statistics.id IS '{"chinese_title":"统计 ID","english_title":"Statistic ID","chinese_description":"统计唯一标识符","english_description":"Unique identifier for statistic"}';
COMMENT ON COLUMN blog_statistics.online_start_date IS '{"chinese_title":"上线日期","english_title":"Online Date","chinese_description":"博客上线起始日期","english_description":"Blog online start date"}';
COMMENT ON COLUMN blog_statistics.total_words IS '{"chinese_title":"总字数","english_title":"Total Words","chinese_description":"累计字数统计","english_description":"Total word count"}';
COMMENT ON COLUMN blog_statistics.manual_adjustment IS '{"chinese_title":"手动调整","english_title":"Manual Adjustment","chinese_description":"手动调整值","english_description":"Manual adjustment value"}';
COMMENT ON COLUMN blog_statistics.created_at IS '{"chinese_title":"创建时间","english_title":"Created At","chinese_description":"记录创建时间","english_description":"Record creation timestamp"}';
COMMENT ON COLUMN blog_statistics.updated_at IS '{"chinese_title":"更新时间","english_title":"Updated At","chinese_description":"记录更新时间","english_description":"Record update timestamp"}';
COMMENT ON COLUMN blog_statistics.is_deleted IS '{"chinese_title":"是否删除","english_title":"Is Deleted","chinese_description":"软删除标记","english_description":"Soft delete flag"}';

-- 创建更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_categories_updated_at
  BEFORE UPDATE ON post_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_post_tags_updated_at
  BEFORE UPDATE ON post_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_post_tag_relations_updated_at
  BEFORE UPDATE ON post_tag_relations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_educations_updated_at
  BEFORE UPDATE ON educations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_project_tags_updated_at
  BEFORE UPDATE ON project_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_friend_links_updated_at
  BEFORE UPDATE ON friend_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_academic_projects_updated_at
  BEFORE UPDATE ON academic_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_academic_project_tags_updated_at
  BEFORE UPDATE ON academic_project_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_blog_statistics_updated_at
  BEFORE UPDATE ON blog_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_statistics ENABLE ROW LEVEL SECURITY;

-- 授予 anon 和 authenticated 用户权限
GRANT SELECT, INSERT, UPDATE, DELETE ON post_categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON post_tags TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON post_tag_relations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON educations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON experiences TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON project_tags TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON friend_links TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON academic_projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON academic_project_tags TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_statistics TO anon, authenticated;

-- 创建 RLS 策略 - 允许所有用户进行所有操作（公开博客）
CREATE POLICY select_own ON post_categories FOR SELECT USING (true);
CREATE POLICY insert_own ON post_categories FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON post_categories FOR UPDATE USING (true);
CREATE POLICY delete_own ON post_categories FOR DELETE USING (true);

CREATE POLICY select_own ON post_tags FOR SELECT USING (true);
CREATE POLICY insert_own ON post_tags FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON post_tags FOR UPDATE USING (true);
CREATE POLICY delete_own ON post_tags FOR DELETE USING (true);

CREATE POLICY select_own ON posts FOR SELECT USING (true);
CREATE POLICY insert_own ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON posts FOR UPDATE USING (true);
CREATE POLICY delete_own ON posts FOR DELETE USING (true);

CREATE POLICY select_own ON post_tag_relations FOR SELECT USING (true);
CREATE POLICY insert_own ON post_tag_relations FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON post_tag_relations FOR UPDATE USING (true);
CREATE POLICY delete_own ON post_tag_relations FOR DELETE USING (true);

CREATE POLICY select_own ON educations FOR SELECT USING (true);
CREATE POLICY insert_own ON educations FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON educations FOR UPDATE USING (true);
CREATE POLICY delete_own ON educations FOR DELETE USING (true);

CREATE POLICY select_own ON experiences FOR SELECT USING (true);
CREATE POLICY insert_own ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON experiences FOR UPDATE USING (true);
CREATE POLICY delete_own ON experiences FOR DELETE USING (true);

CREATE POLICY select_own ON projects FOR SELECT USING (true);
CREATE POLICY insert_own ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON projects FOR UPDATE USING (true);
CREATE POLICY delete_own ON projects FOR DELETE USING (true);

CREATE POLICY select_own ON project_tags FOR SELECT USING (true);
CREATE POLICY insert_own ON project_tags FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON project_tags FOR UPDATE USING (true);
CREATE POLICY delete_own ON project_tags FOR DELETE USING (true);

CREATE POLICY select_own ON friend_links FOR SELECT USING (true);
CREATE POLICY insert_own ON friend_links FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON friend_links FOR UPDATE USING (true);
CREATE POLICY delete_own ON friend_links FOR DELETE USING (true);

CREATE POLICY select_own ON academic_projects FOR SELECT USING (true);
CREATE POLICY insert_own ON academic_projects FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON academic_projects FOR UPDATE USING (true);
CREATE POLICY delete_own ON academic_projects FOR DELETE USING (true);

CREATE POLICY select_own ON academic_project_tags FOR SELECT USING (true);
CREATE POLICY insert_own ON academic_project_tags FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON academic_project_tags FOR UPDATE USING (true);
CREATE POLICY delete_own ON academic_project_tags FOR DELETE USING (true);

CREATE POLICY select_own ON blog_statistics FOR SELECT USING (true);
CREATE POLICY insert_own ON blog_statistics FOR INSERT WITH CHECK (true);
CREATE POLICY update_own ON blog_statistics FOR UPDATE USING (true);
CREATE POLICY delete_own ON blog_statistics FOR DELETE USING (true);

-- 插入测试数据
-- 文章分类
INSERT INTO post_categories (name, name_en, description, sort_order) VALUES
('研究', 'Research', '人工智能、深度学习等研究方向', 1),
('技术', 'Technical', '编程技术、开发经验分享', 2),
('日常', 'Daily Life', '日常生活记录', 3),
('月刊', 'Month Journal', '月度总结与反思', 4);

-- 标签
INSERT INTO post_tags (name) VALUES
('AI'), ('Deep Learning'), ('NLP'), ('React'), ('JavaScript'),
('Performance'), ('Life'), ('Review'), ('Outdoor'), ('GNN'),
('Knowledge Graph'), ('Robotics'), ('Multimodal'), ('Optimization');

-- 文章
INSERT INTO posts (title, title_en, excerpt, excerpt_en, content, content_en, category_id, views, is_published, published_at) VALUES
('深入理解 Transformer 架构', 'Understanding Transformer Architecture',
 'Transformer 模型彻底改变了自然语言处理领域。本文将深入探讨其核心机制，包括自注意力机制、位置编码等关键概念。',
 'Transformer models have revolutionized NLP. This article explores its core mechanisms including self-attention and positional encoding.',
 '# 引言

Transformer 模型自 2017 年提出以来，彻底改变了自然语言处理领域。本文将深入探讨其核心机制。

## 自注意力机制

自注意力机制是 Transformer 的核心创新。它允许模型在处理序列时，关注输入的不同部分。

### 计算过程

1. 计算 Query、Key、Value 矩阵
2. 计算注意力分数
3. 应用 Softmax 归一化
4. 加权求和得到输出

## 位置编码

由于 Transformer 没有递归结构，需要显式地注入位置信息。

## 总结

Transformer 的成功在于其并行化能力和强大的长距离依赖建模能力。',
 '# Introduction

Since its introduction in 2017, the Transformer model has revolutionized NLP. This article explores its core mechanisms.

## Self-Attention Mechanism

Self-attention is the core innovation of Transformer. It allows the model to focus on different parts of the input when processing sequences.

### Calculation Process

1. Compute Query, Key, Value matrices
2. Calculate attention scores
3. Apply Softmax normalization
4. Weighted sum to get output

## Positional Encoding

Since Transformer lacks recursive structure, positional information needs to be explicitly injected.

## Conclusion

Transformer''s success lies in its parallelization capability and powerful long-range dependency modeling.',
 (SELECT id FROM post_categories WHERE name = '研究'), 1234, true, '2026-04-10'),

('React 性能优化最佳实践', 'React Performance Optimization Best Practices',
 '在大型 React 应用中，性能优化至关重要。本文分享了一系列实用的优化技巧和最佳实践。',
 'Performance optimization is crucial in large React applications. This article shares practical tips and best practices.',
 '# React 性能优化

## 使用 useMemo 和 useCallback

## 避免不必要的重渲染

## 代码分割',
 '# React Performance Optimization

## Use useMemo and useCallback

## Avoid Unnecessary Re-renders

## Code Splitting',
 (SELECT id FROM post_categories WHERE name = '技术'), 892, true, '2026-04-05'),

('我的 2026 年第一季度总结', 'My Q1 2026 Review',
 '回顾过去三个月的学习、工作和生活，分享一些感悟和收获。',
 'Looking back at the past three months of study, work, and life, sharing some thoughts and gains.',
 '# 2026 Q1 总结

## 工作进展

## 学习收获

## 生活感悟',
 '# Q1 2026 Review

## Work Progress

## Learning Gains

## Life Reflections',
 (SELECT id FROM post_categories WHERE name = '月刊'), 567, true, '2026-04-01'),

('周末徒步记录', 'Weekend Hiking Record',
 '上周末去爬了附近的山，记录一下沿途的美景和感受。',
 'Went hiking in the nearby mountains last weekend, recording the scenery and feelings along the way.',
 '# 周末徒步

## 路线

## 风景

## 感受',
 '# Weekend Hiking

## Route

## Scenery

## Feelings',
 (SELECT id FROM post_categories WHERE name = '日常'), 423, true, '2026-03-28');

-- 文章标签关联
INSERT INTO post_tag_relations (post_id, tag_id) VALUES
((SELECT id FROM posts WHERE title = '深入理解 Transformer 架构'), (SELECT id FROM post_tags WHERE name = 'AI')),
((SELECT id FROM posts WHERE title = '深入理解 Transformer 架构'), (SELECT id FROM post_tags WHERE name = 'Deep Learning')),
((SELECT id FROM posts WHERE title = '深入理解 Transformer 架构'), (SELECT id FROM post_tags WHERE name = 'NLP')),
((SELECT id FROM posts WHERE title = 'React 性能优化最佳实践'), (SELECT id FROM post_tags WHERE name = 'React')),
((SELECT id FROM posts WHERE title = 'React 性能优化最佳实践'), (SELECT id FROM post_tags WHERE name = 'JavaScript')),
((SELECT id FROM posts WHERE title = 'React 性能优化最佳实践'), (SELECT id FROM post_tags WHERE name = 'Performance')),
((SELECT id FROM posts WHERE title = '我的 2026 年第一季度总结'), (SELECT id FROM post_tags WHERE name = 'Life')),
((SELECT id FROM posts WHERE title = '我的 2026 年第一季度总结'), (SELECT id FROM post_tags WHERE name = 'Review')),
((SELECT id FROM posts WHERE title = '周末徒步记录'), (SELECT id FROM post_tags WHERE name = 'Life')),
((SELECT id FROM posts WHERE title = '周末徒步记录'), (SELECT id FROM post_tags WHERE name = 'Outdoor'));

-- 教育经历
INSERT INTO educations (school_name, school_name_en, major, major_en, degree, degree_en, start_date, end_date, sort_order) VALUES
('上海人工智能实验室', 'Shanghai AI Laboratory', '具身智能中心', 'Embodied AI Center', '实习生', 'Intern', '2024-07-01', NULL, 1),
('西安交通大学', 'Xi''an Jiaotong University', '人工智能专业', 'AI Major', '本科', 'Bachelor', '2022-09-01', NULL, 2);

-- 工作/实习经历
INSERT INTO experiences (company_name, company_name_en, position, position_en, start_date, end_date, description, description_en, sort_order) VALUES
('上海人工智能实验室', 'Shanghai AI Laboratory', '具身智能中心实习生', 'Embodied AI Center Intern', '2024-07-01', NULL, '专注于多模态学习和机器人控制方向的研究', 'Focusing on multimodal learning and robotics control research', 1);

-- 项目
INSERT INTO projects (title, title_en, description, description_en, demo_url, code_url, start_date, end_date, sort_order) VALUES
('智能文档助手', 'Smart Document Assistant', '基于 AI 的文档自动化工具，支持智能分类、摘要生成和关键词提取。', 'AI-powered document automation tool supporting intelligent classification, summary generation, and keyword extraction.', '#', '#', '2025-12-01', '2026-03-31', 1),
('个人博客系统', 'Personal Blog System', '功能完整的博客平台，支持 Markdown 编辑、分类标签、评论系统等功能。', 'Full-featured blog platform supporting Markdown editing, categories, tags, and comment system.', '#', '#', '2025-06-01', '2025-11-30', 2),
('在线协作白板', 'Online Collaborative Whiteboard', '实时多人协作白板工具，支持绘图、便签、投票等功能。', 'Real-time collaborative whiteboard tool supporting drawing, sticky notes, and voting.', '#', '#', '2025-01-01', '2025-05-31', 3),
('任务管理应用', 'Task Management App', '简洁高效的任务管理工具，支持看板视图、提醒和团队协作。', 'Simple and efficient task management tool supporting kanban view, reminders, and team collaboration.', '#', '#', '2024-09-01', '2024-12-31', 4);

-- 项目标签关联
INSERT INTO project_tags (project_id, tag_id) VALUES
((SELECT id FROM projects WHERE title = '智能文档助手'), (SELECT id FROM post_tags WHERE name = 'React')),
((SELECT id FROM projects WHERE title = '智能文档助手'), (SELECT id FROM post_tags WHERE name = 'AI')),
((SELECT id FROM projects WHERE title = '个人博客系统'), (SELECT id FROM post_tags WHERE name = 'React')),
((SELECT id FROM projects WHERE title = '在线协作白板'), (SELECT id FROM post_tags WHERE name = 'React')),
((SELECT id FROM projects WHERE title = '任务管理应用'), (SELECT id FROM post_tags WHERE name = 'JavaScript'));

-- 友情链接
INSERT INTO friend_links (name, url, description, description_en, logo, sort_order) VALUES
('阮一峰的网络日志', 'https://www.ruanyifeng.com/blog/', '知名技术博主，分享前端技术、互联网趋势等内容', 'Well-known tech blogger sharing frontend development and internet trends', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-1.jpg?w=100&h=100&q=85', 1),
('酷壳 - CoolShell', 'https://coolshell.cn/', '左耳朵耗子的技术博客，涵盖编程、架构、职场等话题', 'Tech blog covering programming, architecture, and career topics', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-2.jpg?w=100&h=100&q=85', 2),
('美团技术团队', 'https://tech.meituan.com/', '美团官方技术博客，分享大规模系统架构和实践经验', 'Meituan''s official tech blog sharing large-scale system architecture', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-3.jpg?w=100&h=100&q=85', 3),
('Google AI Blog', 'https://ai.googleblog.com/', 'Google 官方 AI 博客，追踪最新人工智能研究进展', 'Google''s official AI blog tracking latest AI research advances', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-4.jpg?w=100&h=100&q=85', 4),
('GitHub Blog', 'https://github.blog/', 'GitHub 官方博客，了解开发者社区动态', 'GitHub''s official blog to learn about developer community updates', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-5.jpg?w=100&h=100&q=85', 5),
('Stack Overflow Blog', 'https://stackoverflow.blog/', '全球最大开发者社区的博客，技术趋势和洞察', 'Blog of the world''s largest developer community with tech trends', 'https://baas-api.wanwang.xin/toc/image/preview/tech-blog-6.jpg?w=100&h=100&q=85', 6);

-- 学术项目
INSERT INTO academic_projects (title, title_en, description, description_en, paper_url, project_url, start_date, end_date, sort_order) VALUES
('多模态具身智能研究', 'Multimodal Embodied AI Research', '研究如何让机器人通过视觉、语言等多模态信息理解环境并执行复杂任务。', 'Research on enabling robots to understand environments and execute complex tasks through multimodal information like vision and language.', '#', '#', '2024-07-01', NULL, 1),
('高效 Transformer 架构优化', 'Efficient Transformer Architecture Optimization', '探索降低 Transformer 模型计算复杂度的方法，提升推理效率。', 'Exploring methods to reduce computational complexity of Transformer models and improve inference efficiency.', '#', '#', '2023-09-01', '2024-06-30', 2),
('基于图神经网络的知识图谱推理', 'Knowledge Graph Reasoning with Graph Neural Networks', '利用图神经网络进行知识图谱补全和关系推理。', 'Using graph neural networks for knowledge graph completion and relation reasoning.', '#', '#', '2022-09-01', '2023-08-31', 3);

-- 学术项目标签关联
INSERT INTO academic_project_tags (project_id, tag_id) VALUES
((SELECT id FROM academic_projects WHERE title = '多模态具身智能研究'), (SELECT id FROM post_tags WHERE name = 'AI')),
((SELECT id FROM academic_projects WHERE title = '多模态具身智能研究'), (SELECT id FROM post_tags WHERE name = 'Robotics')),
((SELECT id FROM academic_projects WHERE title = '高效 Transformer 架构优化'), (SELECT id FROM post_tags WHERE name = 'Deep Learning')),
((SELECT id FROM academic_projects WHERE title = '高效 Transformer 架构优化'), (SELECT id FROM post_tags WHERE name = 'NLP')),
((SELECT id FROM academic_projects WHERE title = '基于图神经网络的知识图谱推理'), (SELECT id FROM post_tags WHERE name = 'GNN')),
((SELECT id FROM academic_projects WHERE title = '基于图神经网络的知识图谱推理'), (SELECT id FROM post_tags WHERE name = 'Knowledge Graph'));

-- 博客统计数据
INSERT INTO blog_statistics (online_start_date, total_words) VALUES
('2024-01-01', 331000);
