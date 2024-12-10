import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { useUser } from '@clerk/clerk-react';

import useFetch from '@/hooks/use-fetch';
import { getJobs } from '@/api/apiJobs'
import { getCompanies } from '@/api/apiCompanies';

import JobCard from '@/components/job-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { State } from 'country-state-city';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectValue } from '@/components/ui/select';


const Joblisting = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [company_id, setCompany_id] = useState('');
    const { isLoaded } = useUser();

    const {
        fn: fnJobs,
        data: jobs,
        loading: loadingJobs,
    } = useFetch(getJobs, {
        location,
        company_id,
        searchQuery,
    });

    const {
        data: companies,
        fn: fnCompanies,
    } = useFetch(getCompanies);

    useEffect(() => {
        if (isLoaded) {
            fnCompanies();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            fnJobs();
        }
    }, [isLoaded, location, company_id, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const query = formData.get("search-query");
        if (query) setSearchQuery(query);
    };

    const clearFilters = () => {
        setCompany_id('');
        setLocation('');
        setSearchQuery('');
    };

    if (!isLoaded) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    }
    return (
        <div>
            <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

            <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
                <Input
                    type="text"
                    placeholder="Search Jobs by Title.."
                    name="search-query"
                    className="h-full flex-1 px-4 text-md"
                />
                <Button variant="blue" type="submit" className="h-full sm:w-28" >
                    Search
                </Button>
            </form>

            <div className='flex flex-col sm:flex-row gap-2'>
                <Select value={location} onValueChange={(value) => setLocation(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {State.getStatesOfCountry("IN").map(({ name }) => {
                                return <SelectItem key={name} value={name}>{name}</SelectItem>
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Company" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {companies?.map(({ name, id }) => {
                                return (<SelectItem key={name} value={id}>{name}</SelectItem>);
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button onClick={clearFilters} variant='destructive' className="sm:w-1/2">Clear Filters</Button>

            </div>

            {loadingJobs && (
                <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
            )}
            {loadingJobs === false && (
                <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {jobs?.length ? (
                        jobs.map((job) => {
                            return <JobCard key={job.id} job={job}
                                savedInit={job.saved?.length > 0}
                            />;
                        })
                    ) : (
                        <div>No Jobs Found 😓</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Joblisting;