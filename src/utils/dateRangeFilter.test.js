describe("Date Range Filtering (Point 47) Query Parameters", () => {
  const buildJobFilterUrl = (baseUrl, { status, page, limit, search, sort, startDate, endDate, jobType, recruiterId }) => {
    let url = `${baseUrl}getRecruiterJobList?status=${status}&page=${page}&limit=${limit}&search=${encodeURIComponent(search || "")}&sort=${sort}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (jobType) url += `&jobType=${encodeURIComponent(jobType)}`;
    if (recruiterId) url += `&recruiterId=${encodeURIComponent(recruiterId)}`;
    return url;
  };

  test("builds recruiter job list URL with jobType and recruiterId", () => {
    const url = buildJobFilterUrl("https://example.com/api/", {
      status: "published",
      page: 1,
      limit: 10,
      search: "developer",
      sort: "newest",
      jobType: "65c123456789",
      recruiterId: "65b987654321",
    });

    expect(url).toContain("jobType=65c123456789");
    expect(url).toContain("recruiterId=65b987654321");
    expect(url).toContain("status=published");
  });

  const buildApplicantFilterQuery = ({ page, limit, status, search, location, skills, education, experienceLevel, salaryRange, startDate, endDate }) => {
    const query = [];
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
    if (status) query.push(`status=${status}`);
    if (search) query.push(`search=${search}`);
    if (location) query.push(`location=${location}`);
    if (skills) query.push(`skills=${skills}`);
    if (education) query.push(`education=${education}`);
    if (experienceLevel) query.push(`experienceLevel=${experienceLevel}`);
    if (salaryRange) query.push(`salaryRange=${salaryRange}`);
    if (startDate) query.push(`startDate=${startDate}`);
    if (endDate) query.push(`endDate=${endDate}`);
    return `?${query.join("&")}`;
  };

  test("builds recruiter job list URL with startDate and endDate", () => {
    const url = buildJobFilterUrl("https://example.com/api/", {
      status: "published",
      page: 1,
      limit: 10,
      search: "developer",
      sort: "newest",
      startDate: "2026-08-01",
      endDate: "2026-08-17",
    });

    expect(url).toContain("startDate=2026-08-01");
    expect(url).toContain("endDate=2026-08-17");
    expect(url).toContain("status=published");
    expect(url).toContain("search=developer");
  });

  test("builds applicant filter query with startDate and endDate", () => {
    const query = buildApplicantFilterQuery({
      page: 1,
      limit: 10,
      status: "Shortlisted",
      search: "John",
      startDate: "2026-07-01",
      endDate: "2026-08-15",
    });

    expect(query).toContain("startDate=2026-07-01");
    expect(query).toContain("endDate=2026-08-15");
    expect(query).toContain("status=Shortlisted");
    expect(query).toContain("search=John");
  });

  test("omits date params when empty", () => {
    const url = buildJobFilterUrl("https://example.com/api/", {
      status: "all",
      page: 1,
      limit: 10,
      search: "",
      sort: "newest",
    });

    expect(url).not.toContain("startDate=");
    expect(url).not.toContain("endDate=");

    const query = buildApplicantFilterQuery({
      page: 1,
      limit: 10,
    });

    expect(query).not.toContain("startDate=");
    expect(query).not.toContain("endDate=");
  });
});
