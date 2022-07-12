import mongoose from "mongoose";
import ContractModel from "../model/contractModel.js";
import contractSchema from "../schema/contractSchema.js";

const createContract = async (req, res) => {
  try {
    console.log("create Contract");
    const validation = await contractSchema.validateAsync(req.body);
    console.log(validation);
    try {
      const contractExist = await ContractModel.findOne({
        id: validation.id,
      });
      console.log("contractExist", contractExist);
      if (contractExist === null) {
        const newContract = await ContractModel({
          id: validation.id,
          contractName: validation.contractName,
          company: validation.company,
          servicePackage: validation.servicePackage,
          serviceItem: validation.serviceItem,
          assets: validation.assets,
          startDate: validation.startDate,
          endDate: validation.endDate,
          typeOfHours: validation.typeOfHours,
          totalEntitlement: validation.totalEntitlement,
          projectManager: validation.projectManager,
          remarks: validation.remarks ?? " ",
          ownerId: validation.ownerId,
          state: validation.state,
        });
        console.log(newContract);
        const result = await newContract.save();
        res.status(201).send({ ok: true, message: result });
      } else {
        return res
          .status(400)
          .send({ ok: false, message: "Contract ID already exist" });
      }
    } catch (error) {
      res.status(402).send(error);
    }
  } catch (error) {
    console.log("error", error);
    if (error.isJoi) {
      res.status(400).send({
        ok: false,
        error: error.details[0].message,
      });
    } else {
      res.status(400).send({ ok: false, error: error });
    }
  }
};
const paginated = async (req, res) => {
  const { page = 1, limit = 10, filterValue, filterColumn } = req.query;
  try {
    console.log("filterValue", typeof filterValue, filterValue);
    // execute query with page and limit values
    if (filterColumn === "id") {
      console.log("filter for id");

      const contract = await ContractModel.find({
        [filterColumn]: { $gte: filterValue },
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await ContractModel.find({
        [filterColumn]: { $gte: filterValue },
      }).count();

      // return response with posts, total pages, and current page
      res.json({
        ok: true,
        contract: contract,
        totalPages: Math.ceil(count / limit),
        currentPage: page === "NaN" ? 1 : page,
        totalRow: count,
      });
    } else if (
      filterColumn === "contractName" ||
      filterColumn === "company" ||
      filterColumn === "servicePackage" ||
      filterColumn === "typeOfHours" ||
      filterColumn === "projectManager" ||
      filterColumn === "remarks"
    ) {
      console.log("filter for string");

      const newRegex = new RegExp(`${filterValue}`, "i");
      const contract = await ContractModel.find({
        [filterColumn]: { $regex: newRegex },
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await ContractModel.find({
        [filterColumn]: { $regex: newRegex },
      }).count();
      console.log("count", count);
      console.log("limit", limit);
      // return response with posts, total pages, and current page
      res.json({
        ok: true,
        contract: contract,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalRow: count,
      });
    } else if (filterColumn === "assets") {
      console.log("filterColumn", filterColumn.toLowerCase());
      const arrayofData = filterValue.split(",");
      console.log("arrayofData", arrayofData);

      const contract = await ContractModel.find({
        [filterColumn.toLowerCase()]: { $in: arrayofData },
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await ContractModel.find({
        [filterColumn]: { $in: arrayofData },
      }).count();

      // return response with posts, total pages, and current page
      res.json({
        ok: true,
        contract: contract,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalRow: count,
      });
    } else {
      const contract = await ContractModel.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await ContractModel.countDocuments();

      res.json({
        ok: true,
        contract: contract,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalRow: count,
      });
    }

    // get total documents in the Posts collection
  } catch (err) {
    console.log("Error", err);
    res.status(400).send({ ok: false, error: err });
  }
};
const getContract = async (req, res) => {
  const result = await ContractModel.find();
  res.send({ ok: true, contracts: result });
};

export default createContract;
export { getContract, paginated };
