const projectService = require("../../services/project/projectService");
const PhotoService = require("../../helper/image/image-server");
const categoryHelper = require("../../helper/category/categoryValidation");
const Category = require("../../models/category");
const StatusCodes = require("../../config");

const addProject = async (req, res) => {
  const {
    isPortfolio,
    isFeature,
    project_name,
    project_description,
    category,
    architects,
    gross_built_area,
    project_location,
    completion_year,
    captions,
  } = req.body;

  // const { error, errorMessage } = await categoryHelper.categoryValidation(
  //   Category,
  //   category
  // );

  // if (error) {
  //   res.status(StatusCodes.CLIENT_ERROR.BAD_REQUEST).json({
  //     message: errorMessage,
  //   });
  // }
  const safeCaptions = (Array.isArray(captions) ? captions : [captions]).map(
    (caption) => (caption === "undefined" ? "" : caption)
  );

  const photoService = new PhotoService(req.files);
  let project_photo_links;

  await photoService
    .upload()
    .then((link) => {
      project_photo_links = link;
    })
    .catch((error) => {
      console.error("Error uploading photo:", error);
      res.status(400).json({
        message: `Error uploading photo:: ${error}`,
      });
    });

  const project_data = {
    isPortfolio: isPortfolio == "true" ? true : false,
    isFeature: isFeature == "true" ? true : false,
    project_name,
    project_description,
    category,
    architects,
    gross_built_area,
    project_location,
    completion_year,
    captions: safeCaptions,
    featured_image: project_photo_links[0],
    project_photo_links,
  };

  const { message, statusCode } = await projectService.addProject(project_data);

  res.status(statusCode).json({
    message,
  });
};

const updateProject = async (req, res) => {
  const { project_id } = req.params;
  const {
    isPortfolio,
    isFeature,
    project_name,
    project_description,
    category,
    architects,
    gross_built_area,
    project_location,
    completion_year,
    captions,
    photoLinks,
  } = req.body;

  // const { error, errorMessage } = await categoryHelper.categoryValidation(
  //   Category,
  //   category
  // );

  // if (error) {
  //   res.status(StatusCodes.CLIENT_ERROR.BAD_REQUEST).json({
  //     message: errorMessage,
  //   });
  // }

  const photoService = new PhotoService(req.files);
  let new_project_photo_links;

  await photoService
    .upload()
    .then((link) => {
      new_project_photo_links = link;
    })
    .catch((error) => {
      console.error("Error uploading photo:", error);
      res.status(400).json({
        message: `Error uploading photo:: ${error}`,
      });
    });

  const project_data = {
    isPortfolio: isPortfolio == "true" ? true : false,
    isFeature: isFeature == "true" ? true : false,
    project_name,
    project_description,
    category,
    architects,
    gross_built_area,
    project_location,
    completion_year,
    captions,
    featured_image: typeof photoLinks === "string" ? photoLinks : photoLinks[0],
    project_photo_links: (typeof photoLinks === "string"
      ? [photoLinks]
      : photoLinks
    ).concat(new_project_photo_links),
  };

  const { message, statusCode } = await projectService.updateProject(
    project_id,
    project_data
  );

  res.status(statusCode).json({
    message,
  });
};

const getProjects = async (req, res) => {
  const category_name = req.query.category;

  const { message, projects, statusCode } = await projectService.getProjects(
    category_name
  );

  res.status(statusCode).json({
    message,
    projects,
  });
};

const getProject = async (req, res) => {
  const { project_slug } = req.params;

  const { message, project, statusCode } = await projectService.getProject(
    project_slug
  );

  res.status(statusCode).json({
    message,
    project,
  });
};

const deleteProject = async (req, res) => {
  const { project_id } = req.params;

  const { message, statusCode } = await projectService.deleteProject(
    project_id
  );

  res.status(statusCode).json({
    message,
  });
};

module.exports = {
  addProject,
  getProjects,
  getProject,
  deleteProject,
  updateProject,
};
